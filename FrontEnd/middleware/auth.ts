/**
 * Authentication middleware
 *
 * This middleware ensures that only authenticated users can access protected routes.
 * It checks for valid authentication tokens and redirects unauthenticated users to login.
 */

export default defineNuxtRouteMiddleware(async (to, from) => {
  // Only run on client side
  if (process.server) return;

  const authStore = useAuthStore();

  try {
    // Check if user is authenticated
    if (!authStore.isAuthenticated) {
      console.warn("Protected route access denied: User not authenticated");

      // Store the intended destination for redirect after login
      const redirectTo = to.fullPath;

      return navigateTo(`/login?redirect=${encodeURIComponent(redirectTo)}`);
    }

    // Verify token is still valid by attempting to fetch user profile
    if (authStore.user && authStore.token) {
      // Periodically refresh user data to ensure roles/permissions are up-to-date
      const lastFetch = authStore.user.lastFetch || 0;
      const now = Date.now();
      const fiveMinutes = 5 * 60 * 1000;

      if (now - lastFetch > fiveMinutes) {
        try {
          await authStore.fetchUserProfile();
          authStore.user.lastFetch = now;
        } catch (error: any) {
          // If token is invalid, logout and redirect
          if (error.response?.status === 401) {
            console.warn("Token expired, logging out user");
            await authStore.logout();
            return navigateTo("/login");
          }
        }
      }
    }

    // Authentication successful
    console.log(
      "Authenticated route access granted for user:",
      authStore.user?.email
    );
  } catch (error: any) {
    console.error("Auth middleware error:", error);

    // On error, redirect to login for security
    return navigateTo("/login");
  }
});
