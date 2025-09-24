/**
 * Admin route protection middleware
 *
 * This middleware ensures that only authenticated users with admin privileges
 * can access admin routes. It performs both client-side and server-side verification.
 *
 * Security features:
 * - Checks authentication status
 * - Verifies admin role from server
 * - Prevents unauthorized access to admin pages
 * - Redirects non-admin users to appropriate pages
 */

export default defineNuxtRouteMiddleware(async (to, from) => {
  // Only run on client side for better UX
  if (process.server) return;

  const { $api } = useNuxtApp() as { $api: any };
  const authStore = useAuthStore();

  try {
    // First check if user is authenticated
    if (!authStore.isAuthenticated) {
      console.warn("Admin route access denied: User not authenticated");

      // Store the intended destination for redirect after login
      const redirectTo = to.fullPath;

      return navigateTo(`/login?redirect=${encodeURIComponent(redirectTo)}`);
    }

    // Verify admin access with server-side check
    const isAdminVerified = await authStore.verifyAdminAccess();

    if (!isAdminVerified) {
      console.warn("Admin route access denied: User is not admin");

      // Log security attempt for monitoring
      try {
        await $api.post("/api/security/log-unauthorized-access", {
          route: to.fullPath,
          timestamp: new Date().toISOString(),
          userEmail: authStore.user?.email,
        });
      } catch (logError) {
        console.error("Failed to log security incident:", logError);
      }

      // Show error message and redirect to dashboard
      const toast = useToast();
      toast.add({
        title: "Zugriff verweigert",
        description:
          "Sie haben keine Berechtigung für den Administrator-Bereich.",
        color: "red",
        timeout: 5000,
      });

      return navigateTo("/");
    }

    // Admin verification successful - allow access
    console.log("Admin route access granted for user:", authStore.user?.email);
  } catch (error: any) {
    console.error("Admin middleware error:", error);

    // On verification error, redirect to login for security
    const toast = useToast();
    toast.add({
      title: "Verifizierung fehlgeschlagen",
      description:
        "Ihre Berechtigung konnte nicht überprüft werden. Bitte melden Sie sich erneut an.",
      color: "red",
      timeout: 5000,
    });

    return navigateTo("/login");
  }
});
