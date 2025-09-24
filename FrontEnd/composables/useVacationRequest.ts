/**
 * Vacation Request composable for easy access to vacation request store functionality
 */
export const useVacationRequest = () => {
  const vacationRequestStore = useVacationRequestStore();

  return {
    // State
    requests: computed(() => vacationRequestStore.items),
    myRequests: computed(() => vacationRequestStore.myRequests),
    currentRequest: computed(() => vacationRequestStore.currentItem),
    statistics: computed(() => vacationRequestStore.statistics),
    balance: computed(() => vacationRequestStore.balance),
    calendarEvents: computed(() => vacationRequestStore.calendarEvents),
    conflicts: computed(() => vacationRequestStore.conflicts),
    loading: computed(() => vacationRequestStore.loading),
    error: computed(() => vacationRequestStore.error),
    total: computed(() => vacationRequestStore.total),
    page: computed(() => vacationRequestStore.page),
    pageSize: computed(() => vacationRequestStore.pageSize),

    // Getters
    hasRequests: computed(() => vacationRequestStore.hasItems),
    hasError: computed(() => vacationRequestStore.hasError),
    isLoading: computed(() => vacationRequestStore.isLoading),
    totalPages: computed(() => vacationRequestStore.totalPages),

    // Employee actions
    getMyRequests: vacationRequestStore.getMyRequests,
    createMyRequest: vacationRequestStore.createMyRequest,
    updateMyRequest: vacationRequestStore.updateMyRequest,
    cancelMyRequest: vacationRequestStore.cancelMyRequest,
    getMyBalance: vacationRequestStore.getMyBalance,

    // Admin actions
    getAllRequests: vacationRequestStore.getAllRequests,
    approveRequest: vacationRequestStore.approveRequest,
    rejectRequest: vacationRequestStore.rejectRequest,
    getStatistics: vacationRequestStore.getStatistics,
    getCalendarEvents: vacationRequestStore.getCalendarEvents,
    checkConflicts: vacationRequestStore.checkConflicts,
    exportRequests: vacationRequestStore.exportRequests,
    getRequestsByStatus: vacationRequestStore.getRequestsByStatus,
    getRequestsByType: vacationRequestStore.getRequestsByType,
    getPendingRequests: vacationRequestStore.getPendingRequests,
    getCurrentVacations: vacationRequestStore.getCurrentVacations,

    // Base actions
    getRequestById: vacationRequestStore.getById,
    refreshRequests: vacationRequestStore.refresh,

    // Utility methods
    calculateWorkingDays: vacationRequestStore.calculateWorkingDays,
    validateDates: vacationRequestStore.validateDates,
    clearCurrentRequest: vacationRequestStore.clearCurrentItem,
    clearRequests: vacationRequestStore.clearItems,
    clearMyRequests: vacationRequestStore.clearMyRequests,
    clearStatistics: vacationRequestStore.clearStatistics,
    clearBalance: vacationRequestStore.clearBalance,
    clearCalendarEvents: vacationRequestStore.clearCalendarEvents,
    clearConflicts: vacationRequestStore.clearConflicts,
    clearError: vacationRequestStore.clearError,
    setPage: vacationRequestStore.setPage,
    setPageSize: vacationRequestStore.setPageSize,

    // Helper methods
    createQuickRequest: (
      type: "annual" | "sick" | "personal",
      startDate: string,
      endDate: string,
      reason?: string
    ) => {
      const dayCount = vacationRequestStore.calculateWorkingDays(
        startDate,
        endDate
      );

      return vacationRequestStore.createMyRequest({
        type,
        startDate,
        endDate,
        reason,
      });
    },

    getUpcomingVacations: () => {
      const today = new Date().toISOString().split("T")[0];
      return vacationRequestStore.getMyRequests({
        status: "approved",
        dateFrom: today,
      });
    },

    getPastVacations: () => {
      const today = new Date().toISOString().split("T")[0];
      return vacationRequestStore.getMyRequests({
        status: "approved",
        dateTo: today,
      });
    },

    getThisYearRequests: () => {
      const year = new Date().getFullYear();
      const yearStart = `${year}-01-01`;
      const yearEnd = `${year}-12-31`;

      return vacationRequestStore.getMyRequests({
        dateFrom: yearStart,
        dateTo: yearEnd,
      });
    },

    canCancelRequest: (request: any) => {
      if (!request) return false;

      // Can only cancel pending or approved requests
      if (!["pending", "approved"].includes(request.status)) return false;

      // Can't cancel if vacation has already started
      const today = new Date();
      const startDate = new Date(request.startDate);

      return startDate > today;
    },

    canEditRequest: (request: any) => {
      if (!request) return false;

      // Can only edit pending requests
      return request.status === "pending";
    },

    getVacationTypeColor: (type: string) => {
      switch (type) {
        case "annual":
          return "green";
        case "sick":
          return "red";
        case "personal":
          return "blue";
        case "training":
          return "purple";
        case "maternity":
          return "pink";
        case "paternity":
          return "indigo";
        default:
          return "gray";
      }
    },

    getVacationTypeLabel: (type: string) => {
      switch (type) {
        case "annual":
          return "Jahresurlaub";
        case "sick":
          return "Krankheit";
        case "personal":
          return "Persönlich";
        case "training":
          return "Fortbildung";
        case "maternity":
          return "Mutterschaftsurlaub";
        case "paternity":
          return "Vaterschaftsurlaub";
        default:
          return "Sonstige";
      }
    },

    getStatusColor: (status: string) => {
      switch (status) {
        case "approved":
          return "green";
        case "rejected":
          return "red";
        case "pending":
          return "orange";
        case "cancelled":
          return "gray";
        default:
          return "gray";
      }
    },

    getStatusLabel: (status: string) => {
      switch (status) {
        case "approved":
          return "Genehmigt";
        case "rejected":
          return "Abgelehnt";
        case "pending":
          return "Ausstehend";
        case "cancelled":
          return "Storniert";
        default:
          return "Unbekannt";
      }
    },
  };
};
