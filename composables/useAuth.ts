/**
 * Auth composable for easy access to authentication functionality
 * This provides a convenient way to access the auth store and its methods
 */

export const useAuth = () => {
  // Get the auth store instance
  const authStore = useAuthStore();

  // Return auth store methods and computed properties
  return {
    // State
    user: computed(() => authStore.user),
    isAuthenticated: computed(() => authStore.isAuthenticated),
    token: computed(() => authStore.token),

    // Getters
    isAdmin: computed(() => authStore.isAdmin),
    hasPermission: authStore.hasPermission,
    hasRole: authStore.hasRole,
    hasAllPermissions: authStore.hasAllPermissions,
    hasAnyPermission: authStore.hasAnyPermission,

    // Actions
    login: authStore.login,
    logout: authStore.logout,
    fetchUserProfile: authStore.fetchUserProfile,
    verifyAdminAccess: authStore.verifyAdminAccess,
    verifyPermission: authStore.verifyPermission,
    initializeAuth: authStore.initializeAuth,

    // Helper methods
    requireAuth() {
      if (!authStore.isAuthenticated) {
        throw createError({
          statusCode: 401,
          statusMessage: "Authentication required",
        });
      }
    },

    async requireAdmin() {
      this.requireAuth();
      const isAdmin = await authStore.verifyAdminAccess();
      if (!isAdmin) {
        throw createError({
          statusCode: 403,
          statusMessage: "Admin access required",
        });
      }
    },

    async requirePermission(permission: string) {
      this.requireAuth();
      const hasPermission = await authStore.verifyPermission(permission);
      if (!hasPermission) {
        throw createError({
          statusCode: 403,
          statusMessage: `Permission required: ${permission}`,
        });
      }
    },
  };
};
