import { defineStore } from "pinia";
import { BaseEntityStore } from "./base";
import type {
  IWorkEntry,
  IWorkEntryCreate,
  IWorkEntryUpdate,
  IWorkEntryAdminUpdate,
  IWorkEntryApproval,
  IWorkEntryRejection,
  IWorkEntryBulkAction,
  IWorkEntryFilter,
  IWorkEntryStatistics,
  IWorkEntryExportOptions,
  TWorkEntryStatus,
  IApiResponse,
} from "~/types";

/**
 * Work Entry store class extending BaseEntityStore
 */
class WorkEntryStoreClass extends BaseEntityStore<
  IWorkEntry,
  IWorkEntryCreate,
  IWorkEntryUpdate,
  IWorkEntryFilter
> {
  // Additional state for work entries
  public statistics = ref<IWorkEntryStatistics | null>(null);
  public myEntries = ref<IWorkEntry[]>([]);

  constructor() {
    super("/api/work-entries", "WorkEntry");
  }

  /**
   * Get current user's work entries
   */
  async getMyEntries(
    filter?: Omit<IWorkEntryFilter, "userId">
  ): Promise<IWorkEntry[]> {
    this.setLoading(true);
    try {
      const params = {
        page: this.page.value,
        pageSize: this.pageSize.value,
        ...filter,
      };

      const response = await this.api.get("/api/work-entries/me", { params });
      const data = response.data;

      this.myEntries.value = data.data;
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
   * Create work entry for current user
   */
  async createMyEntry(payload: IWorkEntryCreate): Promise<IWorkEntry> {
    this.setLoading(true);
    try {
      const response = await this.api.post("/api/work-entries", payload);
      const data: IApiResponse<IWorkEntry> = response.data;

      // Add to my entries
      this.myEntries.value.unshift(data.data);
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
   * Update own work entry
   */
  async updateMyEntry(
    id: string,
    payload: IWorkEntryUpdate
  ): Promise<IWorkEntry> {
    this.setLoading(true);
    try {
      const response = await this.api.put(`/api/work-entries/${id}`, payload);
      const data: IApiResponse<IWorkEntry> = response.data;

      // Update in my entries
      const index = this.myEntries.value.findIndex((entry) => entry.id === id);
      if (index !== -1) {
        this.myEntries.value[index] = data.data;
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
   * Delete own work entry
   */
  async deleteMyEntry(id: string): Promise<void> {
    this.setLoading(true);
    try {
      await this.api.delete(`/api/work-entries/${id}`);

      // Remove from my entries
      this.myEntries.value = this.myEntries.value.filter(
        (entry) => entry.id !== id
      );

      // Clear current item if it was deleted
      if (this.currentItem.value?.id === id) {
        this.currentItem.value = null;
      }
    } catch (error: any) {
      this.handleError(error);
      throw error;
    } finally {
      this.setLoading(false);
    }
  }

  /**
   * Submit work entry for approval
   */
  async submitForApproval(id: string): Promise<IWorkEntry> {
    return this.patch(id, { status: "pending" as TWorkEntryStatus });
  }

  // Admin-only methods

  /**
   * Get all work entries (admin only)
   */
  async getAllEntries(filter?: IWorkEntryFilter): Promise<IWorkEntry[]> {
    this.setLoading(true);
    try {
      const params = {
        page: this.page.value,
        pageSize: this.pageSize.value,
        ...filter,
      };

      const response = await this.api.get("/api/admin/work-entries", {
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
   * Approve work entry (admin only)
   */
  async approveEntry(
    id: string,
    payload: IWorkEntryApproval
  ): Promise<IWorkEntry> {
    this.setLoading(true);
    try {
      const response = await this.api.patch(
        `/api/admin/work-entries/${id}/approve`,
        payload
      );
      const data: IApiResponse<IWorkEntry> = response.data;

      // Update in local items
      const index = this.items.value.findIndex((entry) => entry.id === id);
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
   * Reject work entry (admin only)
   */
  async rejectEntry(
    id: string,
    payload: IWorkEntryRejection
  ): Promise<IWorkEntry> {
    this.setLoading(true);
    try {
      const response = await this.api.patch(
        `/api/admin/work-entries/${id}/reject`,
        payload
      );
      const data: IApiResponse<IWorkEntry> = response.data;

      // Update in local items
      const index = this.items.value.findIndex((entry) => entry.id === id);
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
   * Bulk approve work entries (admin only)
   */
  async bulkApprove(payload: IWorkEntryBulkAction): Promise<IWorkEntry[]> {
    this.setLoading(true);
    try {
      const response = await this.api.patch(
        "/api/admin/work-entries/bulk-approve",
        payload
      );
      const data: IApiResponse<IWorkEntry[]> = response.data;

      // Update local items
      data.data.forEach((updatedEntry) => {
        const index = this.items.value.findIndex(
          (entry) => entry.id === updatedEntry.id
        );
        if (index !== -1) {
          this.items.value[index] = updatedEntry;
        }
      });

      return data.data;
    } catch (error: any) {
      this.handleError(error);
      throw error;
    } finally {
      this.setLoading(false);
    }
  }

  /**
   * Bulk reject work entries (admin only)
   */
  async bulkReject(payload: IWorkEntryBulkAction): Promise<IWorkEntry[]> {
    this.setLoading(true);
    try {
      const response = await this.api.patch(
        "/api/admin/work-entries/bulk-reject",
        payload
      );
      const data: IApiResponse<IWorkEntry[]> = response.data;

      // Update local items
      data.data.forEach((updatedEntry) => {
        const index = this.items.value.findIndex(
          (entry) => entry.id === updatedEntry.id
        );
        if (index !== -1) {
          this.items.value[index] = updatedEntry;
        }
      });

      return data.data;
    } catch (error: any) {
      this.handleError(error);
      throw error;
    } finally {
      this.setLoading(false);
    }
  }

  /**
   * Admin update work entry
   */
  async adminUpdate(
    id: string,
    payload: IWorkEntryAdminUpdate
  ): Promise<IWorkEntry> {
    this.setLoading(true);
    try {
      const response = await this.api.put(
        `/api/admin/work-entries/${id}`,
        payload
      );
      const data: IApiResponse<IWorkEntry> = response.data;

      // Update in local items
      const index = this.items.value.findIndex((entry) => entry.id === id);
      if (index !== -1) {
        this.items.value[index] = data.data;
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
   * Get work entry statistics
   */
  async getStatistics(
    filter?: Omit<IWorkEntryFilter, "page" | "pageSize">
  ): Promise<IWorkEntryStatistics> {
    this.setLoading(true);
    try {
      const response = await this.api.get(
        "/api/admin/work-entries/statistics",
        {
          params: filter,
        }
      );
      const data: IApiResponse<IWorkEntryStatistics> = response.data;

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
   * Export work entries
   */
  async exportEntries(options: IWorkEntryExportOptions): Promise<Blob> {
    this.setLoading(true);
    try {
      const response = await this.api.get("/api/admin/work-entries/export", {
        params: options,
        responseType: "blob",
      });

      return response.data;
    } catch (error: any) {
      this.handleError(error);
      throw error;
    } finally {
      this.setLoading(false);
    }
  }

  /**
   * Get entries by status
   */
  async getEntriesByStatus(status: TWorkEntryStatus): Promise<IWorkEntry[]> {
    return this.getAllEntries({ status });
  }

  /**
   * Get pending entries for approval
   */
  async getPendingEntries(): Promise<IWorkEntry[]> {
    return this.getEntriesByStatus("pending");
  }

  /**
   * Clear my entries
   */
  clearMyEntries(): void {
    this.myEntries.value = [];
  }

  /**
   * Clear statistics
   */
  clearStatistics(): void {
    this.statistics.value = null;
  }

  /**
   * Calculate duration between start and end time
   */
  calculateDuration(
    startTime: string,
    endTime: string,
    breakMinutes: number = 0
  ): number {
    const [startHour, startMin] = startTime.split(":").map(Number);
    const [endHour, endMin] = endTime.split(":").map(Number);

    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;

    const totalMinutes = endMinutes - startMinutes - breakMinutes;
    return Math.max(0, totalMinutes);
  }

  /**
   * Format duration in hours and minutes
   */
  formatDuration(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  }
}

/**
 * Work Entry store using Pinia
 */
export const useWorkEntryStore = defineStore("workEntry", () => {
  const store = new WorkEntryStoreClass();

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
    myEntries: store.myEntries,

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
    getMyEntries: store.getMyEntries.bind(store),
    createMyEntry: store.createMyEntry.bind(store),
    updateMyEntry: store.updateMyEntry.bind(store),
    deleteMyEntry: store.deleteMyEntry.bind(store),
    submitForApproval: store.submitForApproval.bind(store),

    // Admin actions
    getAllEntries: store.getAllEntries.bind(store),
    approveEntry: store.approveEntry.bind(store),
    rejectEntry: store.rejectEntry.bind(store),
    bulkApprove: store.bulkApprove.bind(store),
    bulkReject: store.bulkReject.bind(store),
    adminUpdate: store.adminUpdate.bind(store),
    getStatistics: store.getStatistics.bind(store),
    exportEntries: store.exportEntries.bind(store),
    getEntriesByStatus: store.getEntriesByStatus.bind(store),
    getPendingEntries: store.getPendingEntries.bind(store),

    // Utility actions
    clearMyEntries: store.clearMyEntries.bind(store),
    clearStatistics: store.clearStatistics.bind(store),
    calculateDuration: store.calculateDuration.bind(store),
    formatDuration: store.formatDuration.bind(store),
  };
});
