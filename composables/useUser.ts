/**
 * User composable for easy access to user store functionality
 */
export const useUser = () => {
  const userStore = useUserStore();

  return {
    // State
    users: computed(() => userStore.items),
    currentUser: computed(() => userStore.currentItem),
    loading: computed(() => userStore.loading),
    error: computed(() => userStore.error),
    total: computed(() => userStore.total),
    page: computed(() => userStore.page),
    pageSize: computed(() => userStore.pageSize),

    // Getters
    hasUsers: computed(() => userStore.hasItems),
    hasError: computed(() => userStore.hasError),
    isLoading: computed(() => userStore.isLoading),
    totalPages: computed(() => userStore.totalPages),

    // Actions
    getAllUsers: userStore.getAll,
    getUserById: userStore.getById,
    createUser: userStore.create,
    updateUser: userStore.update,
    patchUser: userStore.patch,
    deleteUser: userStore.delete,
    refreshUsers: userStore.refresh,

    // User-specific actions
    getProfile: userStore.getProfile,
    updateProfile: userStore.updateProfile,
    changePassword: userStore.changePassword,
    assignRoles: userStore.assignRoles,
    assignPermissions: userStore.assignPermissions,
    toggleUserStatus: userStore.toggleUserStatus,
    getUsersByRole: userStore.getUsersByRole,
    getUsersWithCars: userStore.getUsersWithCars,
    searchUsers: userStore.searchUsers,
    uploadProfilePicture: userStore.uploadProfilePicture,
    getAdmins: userStore.getAdmins,
    getEmployees: userStore.getEmployees,

    // Utility methods
    clearCurrentUser: userStore.clearCurrentItem,
    clearUsers: userStore.clearItems,
    clearError: userStore.clearError,
    setPage: userStore.setPage,
    setPageSize: userStore.setPageSize,
  };
};
