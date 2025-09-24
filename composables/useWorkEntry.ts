/**
 * Work Entry composable for easy access to work entry store functionality
 */
export const useWorkEntry = () => {
  const workEntryStore = useWorkEntryStore();

  return {
    // State
    entries: computed(() => workEntryStore.items),
    myEntries: computed(() => workEntryStore.myEntries),
    currentEntry: computed(() => workEntryStore.currentItem),
    statistics: computed(() => workEntryStore.statistics),
    loading: computed(() => workEntryStore.loading),
    error: computed(() => workEntryStore.error),
    total: computed(() => workEntryStore.total),
    page: computed(() => workEntryStore.page),
    pageSize: computed(() => workEntryStore.pageSize),

    // Getters
    hasEntries: computed(() => workEntryStore.hasItems),
    hasError: computed(() => workEntryStore.hasError),
    isLoading: computed(() => workEntryStore.isLoading),
    totalPages: computed(() => workEntryStore.totalPages),

    // Employee actions
    getMyEntries: workEntryStore.getMyEntries,
    createMyEntry: workEntryStore.createMyEntry,
    updateMyEntry: workEntryStore.updateMyEntry,
    deleteMyEntry: workEntryStore.deleteMyEntry,
    submitForApproval: workEntryStore.submitForApproval,

    // Admin actions
    getAllEntries: workEntryStore.getAllEntries,
    approveEntry: workEntryStore.approveEntry,
    rejectEntry: workEntryStore.rejectEntry,
    bulkApprove: workEntryStore.bulkApprove,
    bulkReject: workEntryStore.bulkReject,
    adminUpdate: workEntryStore.adminUpdate,
    getStatistics: workEntryStore.getStatistics,
    exportEntries: workEntryStore.exportEntries,
    getEntriesByStatus: workEntryStore.getEntriesByStatus,
    getPendingEntries: workEntryStore.getPendingEntries,

    // Base actions
    getEntryById: workEntryStore.getById,
    refreshEntries: workEntryStore.refresh,

    // Utility methods
    calculateDuration: workEntryStore.calculateDuration,
    formatDuration: workEntryStore.formatDuration,
    clearCurrentEntry: workEntryStore.clearCurrentItem,
    clearEntries: workEntryStore.clearItems,
    clearMyEntries: workEntryStore.clearMyEntries,
    clearStatistics: workEntryStore.clearStatistics,
    clearError: workEntryStore.clearError,
    setPage: workEntryStore.setPage,
    setPageSize: workEntryStore.setPageSize,

    // Helper methods
    createQuickEntry: (
      date: string,
      startTime: string,
      endTime: string,
      breakMinutes: number = 30
    ) => {
      const durationMinutes = workEntryStore.calculateDuration(
        startTime,
        endTime,
        breakMinutes
      );

      return workEntryStore.createMyEntry({
        date,
        startTime,
        endTime,
        breakMinutes,
      });
    },

    getTodayEntries: () => {
      const today = new Date().toISOString().split("T")[0];
      return workEntryStore.getMyEntries({ dateFrom: today, dateTo: today });
    },

    getThisWeekEntries: () => {
      const today = new Date();
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - today.getDay() + 1); // Monday
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6); // Sunday

      return workEntryStore.getMyEntries({
        dateFrom: weekStart.toISOString().split("T")[0],
        dateTo: weekEnd.toISOString().split("T")[0],
      });
    },

    getThisMonthEntries: () => {
      const today = new Date();
      const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
      const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);

      return workEntryStore.getMyEntries({
        dateFrom: monthStart.toISOString().split("T")[0],
        dateTo: monthEnd.toISOString().split("T")[0],
      });
    },
  };
};
