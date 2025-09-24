import { defineStore } from "pinia";
import { BaseEntityStore } from "./base";
import type {
  IVacationRequest,
  IVacationRequestCreate,
  IVacationRequestUpdate,
  IVacationRequestAdminUpdate,
  IVacationRequestApproval,
  IVacationRequestRejection,
  IVacationRequestCancellation,
  IVacationRequestFilter,
  IVacationBalance,
  IVacationConflict,
  IVacationCalendarEvent,
  IVacationStatistics,
  IVacationExportOptions,
  TVacationRequestStatus,
  TVacationRequestType,
  IApiResponse,
} from "~/types";

/**
 * Vacation Request store class extending BaseEntityStore
 */
class VacationRequestStoreClass extends BaseEntityStore<
  IVacationRequest,
  IVacationRequestCreate,
  IVacationRequestUpdate,
  IVacationRequestFilter
> {
  // Additional state for vacation requests
  public statistics = ref<IVacationStatistics | null>(null);
  public myRequests = ref<IVacationRequest[]>([]);
  public balance = ref<IVacationBalance | null>(null);
  public calendarEvents = ref<IVacationCalendarEvent[]>([]);
  public conflicts = ref<IVacationConflict[]>([]);

  constructor() {
    super("/api/vacation-requests", "VacationRequest");
  }

  /**
   * Get current user's vacation requests
   */
  async getMyRequests(
    filter?: Omit<IVacationRequestFilter, "userId">
  ): Promise<IVacationRequest[]> {
    this.setLoading(true);
    try {
      const params = {
        page: this.page.value,
        pageSize: this.pageSize.value,
        ...filter,
      };

      const response = await this.api.get("/api/vacation-requests/me", {
        params,
      });
      const data = response.data;

      this.myRequests.value = data.data;
      this.total.value = data.total;

      return data.data;
    } catch (error: any) {
      this.handleError(error);
      throw error;
    } finally {
      this.setLoading(false);
    }
  }

  /**
   * Create vacation request for current user
   */
  async createMyRequest(
    payload: IVacationRequestCreate
  ): Promise<IVacationRequest> {
    this.setLoading(true);
    try {
      const formData = new FormData();

      // Add basic fields
      Object.entries(payload).forEach(([key, value]) => {
        if (key !== "attachments" && value !== undefined) {
          formData.append(key, value.toString());
        }
      });

      // Add attachments if any
      if (payload.attachments && payload.attachments.length > 0) {
        payload.attachments.forEach((file, index) => {
          formData.append(`attachments[${index}]`, file);
        });
      }

      const response = await this.api.post("/api/vacation-requests", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      const data: IApiResponse<IVacationRequest> = response.data;

      // Add to my requests
      this.myRequests.value.unshift(data.data);
      this.currentItem.value = data.data;

      return data.data;
    } catch (error: any) {
      this.handleError(error);
      throw error;
    } finally {
      this.setLoading(false);
    }
  }

  /**
   * Update own vacation request
   */
  async updateMyRequest(
    id: string,
    payload: IVacationRequestUpdate
  ): Promise<IVacationRequest> {
    this.setLoading(true);
    try {
      const formData = new FormData();

      // Add basic fields
      Object.entries(payload).forEach(([key, value]) => {
        if (key !== "attachments" && value !== undefined) {
          formData.append(key, value.toString());
        }
      });

      // Add attachments if any
      if (payload.attachments && payload.attachments.length > 0) {
        payload.attachments.forEach((file, index) => {
          formData.append(`attachments[${index}]`, file);
        });
      }

      const response = await this.api.put(
        `/api/vacation-requests/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      const data: IApiResponse<IVacationRequest> = response.data;

      // Update in my requests
      const index = this.myRequests.value.findIndex(
        (request) => request.id === id
      );
      if (index !== -1) {
        this.myRequests.value[index] = data.data;
      }

      this.currentItem.value = data.data;
      return data.data;
    } catch (error: any) {
      this.handleError(error);
      throw error;
    } finally {
      this.setLoading(false);
    }
  }

  /**
   * Cancel own vacation request
   */
  async cancelMyRequest(id: string, reason: string): Promise<IVacationRequest> {
    this.setLoading(true);
    try {
      const response = await this.api.patch(
        `/api/vacation-requests/${id}/cancel`,
        {
          cancellationReason: reason,
        }
      );
      const data: IApiResponse<IVacationRequest> = response.data;

      // Update in my requests
      const index = this.myRequests.value.findIndex(
        (request) => request.id === id
      );
      if (index !== -1) {
        this.myRequests.value[index] = data.data;
      }

      return data.data;
    } catch (error: any) {
      this.handleError(error);
      throw error;
    } finally {
      this.setLoading(false);
    }
  }

  /**
   * Get vacation balance for current user
   */
  async getMyBalance(year?: number): Promise<IVacationBalance> {
    this.setLoading(true);
    try {
      const params = year ? { year } : {};
      const response = await this.api.get("/api/vacation-requests/me/balance", {
        params,
      });
      const data: IApiResponse<IVacationBalance> = response.data;

      this.balance.value = data.data;
      return data.data;
    } catch (error: any) {
      this.handleError(error);
      throw error;
    } finally {
      this.setLoading(false);
    }
  }

  // Admin-only methods

  /**
   * Get all vacation requests (admin only)
   */
  async getAllRequests(
    filter?: IVacationRequestFilter
  ): Promise<IVacationRequest[]> {
    this.setLoading(true);
    try {
      const params = {
        page: this.page.value,
        pageSize: this.pageSize.value,
        ...filter,
      };

      const response = await this.api.get("/api/admin/vacation-requests", {
        params,
      });
      const data = response.data;

      this.items.value = data.data;
      this.total.value = data.total;

      return data.data;
    } catch (error: any) {
      this.handleError(error);
      throw error;
    } finally {
      this.setLoading(false);
    }
  }

  /**
   * Approve vacation request (admin only)
   */
  async approveRequest(
    id: string,
    payload: IVacationRequestApproval
  ): Promise<IVacationRequest> {
    this.setLoading(true);
    try {
      const response = await this.api.patch(
        `/api/admin/vacation-requests/${id}/approve`,
        payload
      );
      const data: IApiResponse<IVacationRequest> = response.data;

      // Update in local items
      const index = this.items.value.findIndex((request) => request.id === id);
      if (index !== -1) {
        this.items.value[index] = data.data;
      }

      return data.data;
    } catch (error: any) {
      this.handleError(error);
      throw error;
    } finally {
      this.setLoading(false);
    }
  }

  /**
   * Reject vacation request (admin only)
   */
  async rejectRequest(
    id: string,
    payload: IVacationRequestRejection
  ): Promise<IVacationRequest> {
    this.setLoading(true);
    try {
      const response = await this.api.patch(
        `/api/admin/vacation-requests/${id}/reject`,
        payload
      );
      const data: IApiResponse<IVacationRequest> = response.data;

      // Update in local items
      const index = this.items.value.findIndex((request) => request.id === id);
      if (index !== -1) {
        this.items.value[index] = data.data;
      }

      return data.data;
    } catch (error: any) {
      this.handleError(error);
      throw error;
    } finally {
      this.setLoading(false);
    }
  }

  /**
   * Get vacation statistics (admin only)
   */
  async getStatistics(
    filter?: Omit<IVacationRequestFilter, "page" | "pageSize">
  ): Promise<IVacationStatistics> {
    this.setLoading(true);
    try {
      const response = await this.api.get(
        "/api/admin/vacation-requests/statistics",
        {
          params: filter,
        }
      );
      const data: IApiResponse<IVacationStatistics> = response.data;

      this.statistics.value = data.data;
      return data.data;
    } catch (error: any) {
      this.handleError(error);
      throw error;
    } finally {
      this.setLoading(false);
    }
  }

  /**
   * Get vacation calendar events
   */
  async getCalendarEvents(
    startDate: string,
    endDate: string
  ): Promise<IVacationCalendarEvent[]> {
    this.setLoading(true);
    try {
      const response = await this.api.get(
        "/api/admin/vacation-requests/calendar",
        {
          params: { startDate, endDate },
        }
      );
      const data: IApiResponse<IVacationCalendarEvent[]> = response.data;

      this.calendarEvents.value = data.data;
      return data.data;
    } catch (error: any) {
      this.handleError(error);
      throw error;
    } finally {
      this.setLoading(false);
    }
  }

  /**
   * Check for vacation conflicts
   */
  async checkConflicts(
    startDate: string,
    endDate: string,
    excludeRequestId?: string
  ): Promise<IVacationConflict[]> {
    this.setLoading(true);
    try {
      const params: any = { startDate, endDate };
      if (excludeRequestId) {
        params.excludeRequestId = excludeRequestId;
      }

      const response = await this.api.get(
        "/api/admin/vacation-requests/conflicts",
        { params }
      );
      const data: IApiResponse<IVacationConflict[]> = response.data;

      this.conflicts.value = data.data;
      return data.data;
    } catch (error: any) {
      this.handleError(error);
      throw error;
    } finally {
      this.setLoading(false);
    }
  }

  /**
   * Export vacation requests
   */
  async exportRequests(options: IVacationExportOptions): Promise<Blob> {
    this.setLoading(true);
    try {
      const response = await this.api.get(
        "/api/admin/vacation-requests/export",
        {
          params: options,
          responseType: "blob",
        }
      );

      return response.data;
    } catch (error: any) {
      this.handleError(error);
      throw error;
    } finally {
      this.setLoading(false);
    }
  }

  /**
   * Get requests by status
   */
  async getRequestsByStatus(
    status: TVacationRequestStatus
  ): Promise<IVacationRequest[]> {
    return this.getAllRequests({ status });
  }

  /**
   * Get requests by type
   */
  async getRequestsByType(
    type: TVacationRequestType
  ): Promise<IVacationRequest[]> {
    return this.getAllRequests({ type });
  }

  /**
   * Get pending requests for approval
   */
  async getPendingRequests(): Promise<IVacationRequest[]> {
    return this.getRequestsByStatus("pending");
  }

  /**
   * Get approved requests (currently on vacation)
   */
  async getCurrentVacations(): Promise<IVacationRequest[]> {
    const today = new Date().toISOString().split("T")[0];
    return this.getAllRequests({
      status: "approved",
      dateFrom: today,
      dateTo: today,
    });
  }

  /**
   * Calculate working days between two dates
   */
  calculateWorkingDays(startDate: string, endDate: string): number {
    const start = new Date(startDate);
    const end = new Date(endDate);
    let count = 0;

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      // Skip weekends (Saturday = 6, Sunday = 0)
      if (d.getDay() !== 0 && d.getDay() !== 6) {
        count++;
      }
    }

    return count;
  }

  /**
   * Validate vacation request dates
   */
  validateDates(
    startDate: string,
    endDate: string
  ): { valid: boolean; error?: string } {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const today = new Date();

    if (start < today) {
      return { valid: false, error: "Start date cannot be in the past" };
    }

    if (end < start) {
      return { valid: false, error: "End date cannot be before start date" };
    }

    if (start.getTime() === end.getTime()) {
      return { valid: false, error: "Start and end date cannot be the same" };
    }

    return { valid: true };
  }

  /**
   * Clear my requests
   */
  clearMyRequests(): void {
    this.myRequests.value = [];
  }

  /**
   * Clear statistics
   */
  clearStatistics(): void {
    this.statistics.value = null;
  }

  /**
   * Clear balance
   */
  clearBalance(): void {
    this.balance.value = null;
  }

  /**
   * Clear calendar events
   */
  clearCalendarEvents(): void {
    this.calendarEvents.value = [];
  }

  /**
   * Clear conflicts
   */
  clearConflicts(): void {
    this.conflicts.value = [];
  }
}

/**
 * Vacation Request store using Pinia
 */
export const useVacationRequestStore = defineStore("vacationRequest", () => {
  const store = new VacationRequestStoreClass();

  return {
    // State
    items: store.items,
    currentItem: store.currentItem,
    loading: store.loading,
    error: store.error,
    total: store.total,
    page: store.page,
    pageSize: store.pageSize,
    statistics: store.statistics,
    myRequests: store.myRequests,
    balance: store.balance,
    calendarEvents: store.calendarEvents,
    conflicts: store.conflicts,

    // Getters
    hasItems: store.hasItems,
    hasError: store.hasError,
    isLoading: store.isLoading,
    totalPages: store.totalPages,

    // Base actions
    getAll: store.getAll.bind(store),
    getById: store.getById.bind(store),
    create: store.create.bind(store),
    update: store.update.bind(store),
    patch: store.patch.bind(store),
    delete: store.delete.bind(store),
    refresh: store.refresh.bind(store),
    clearCurrentItem: store.clearCurrentItem.bind(store),
    clearItems: store.clearItems.bind(store),
    clearError: store.clearError.bind(store),
    setPage: store.setPage.bind(store),
    setPageSize: store.setPageSize.bind(store),

    // Employee actions
    getMyRequests: store.getMyRequests.bind(store),
    createMyRequest: store.createMyRequest.bind(store),
    updateMyRequest: store.updateMyRequest.bind(store),
    cancelMyRequest: store.cancelMyRequest.bind(store),
    getMyBalance: store.getMyBalance.bind(store),

    // Admin actions
    getAllRequests: store.getAllRequests.bind(store),
    approveRequest: store.approveRequest.bind(store),
    rejectRequest: store.rejectRequest.bind(store),
    getStatistics: store.getStatistics.bind(store),
    getCalendarEvents: store.getCalendarEvents.bind(store),
    checkConflicts: store.checkConflicts.bind(store),
    exportRequests: store.exportRequests.bind(store),
    getRequestsByStatus: store.getRequestsByStatus.bind(store),
    getRequestsByType: store.getRequestsByType.bind(store),
    getPendingRequests: store.getPendingRequests.bind(store),
    getCurrentVacations: store.getCurrentVacations.bind(store),

    // Utility actions
    calculateWorkingDays: store.calculateWorkingDays.bind(store),
    validateDates: store.validateDates.bind(store),
    clearMyRequests: store.clearMyRequests.bind(store),
    clearStatistics: store.clearStatistics.bind(store),
    clearBalance: store.clearBalance.bind(store),
    clearCalendarEvents: store.clearCalendarEvents.bind(store),
    clearConflicts: store.clearConflicts.bind(store),
  };
});
