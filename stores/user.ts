import { defineStore } from "pinia";
import { BaseEntityStore } from "./base";
import type {
  IUser,
  IUserCreate,
  IUserPatch,
  IUserProfileUpdate,
  IPasswordChange,
  IUserRoleAssignment,
  IUserPermissionAssignment,
  IApiResponse,
} from "~/types";

/**
 * User filter interface
 */
export interface IUserFilter {
  email?: string;
  fullName?: string;
  roles?: string[];
  isActive?: boolean;
  hasCar?: boolean;
  showAddressPublic?: boolean;
  search?: string;
}

/**
 * User store class extending BaseEntityStore
 */
class UserStoreClass extends BaseEntityStore<
  IUser,
  IUserCreate,
  IUserPatch,
  IUserFilter
> {
  constructor() {
    super("/api/users", "User");
  }

  /**
   * Get current user profile
   */
  async getProfile(): Promise<IUser> {
    this.setLoading(true);
    try {
      const response = await this.api.get("/api/users/me");
      const data: IApiResponse<IUser> = response.data;

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
   * Update current user profile
   */
  async updateProfile(payload: IUserProfileUpdate): Promise<IUser> {
    this.setLoading(true);
    try {
      const response = await this.api.put("/api/users/me", payload);
      const data: IApiResponse<IUser> = response.data;

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
   * Change password
   */
  async changePassword(payload: IPasswordChange): Promise<void> {
    this.setLoading(true);
    try {
      await this.api.post("/api/users/me/change-password", payload);
    } catch (error: any) {
      this.handleError(error);
      throw error;
    } finally {
      this.setLoading(false);
    }
  }

  /**
   * Assign roles to user (admin only)
   */
  async assignRoles(payload: IUserRoleAssignment): Promise<IUser> {
    this.setLoading(true);
    try {
      const response = await this.api.post(
        `/api/admin/users/${payload.userId}/roles`,
        payload
      );
      const data: IApiResponse<IUser> = response.data;

      // Update in local items
      const index = this.items.value.findIndex(
        (item) => item.id === payload.userId
      );
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
   * Assign permissions to user (admin only)
   */
  async assignPermissions(payload: IUserPermissionAssignment): Promise<IUser> {
    this.setLoading(true);
    try {
      const response = await this.api.post(
        `/api/admin/users/${payload.userId}/permissions`,
        payload
      );
      const data: IApiResponse<IUser> = response.data;

      // Update in local items
      const index = this.items.value.findIndex(
        (item) => item.id === payload.userId
      );
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
   * Activate/Deactivate user (admin only)
   */
  async toggleUserStatus(userId: string, isActive: boolean): Promise<IUser> {
    return this.patch(userId, { isActive });
  }

  /**
   * Get users by role
   */
  async getUsersByRole(role: string): Promise<IUser[]> {
    return this.getAll({ roles: [role] });
  }

  /**
   * Get users with cars (for car sharing)
   */
  async getUsersWithCars(): Promise<IUser[]> {
    return this.getAll({ hasCar: true, showAddressPublic: true });
  }

  /**
   * Search users by name or email
   */
  async searchUsers(query: string): Promise<IUser[]> {
    return this.getAll({ search: query });
  }

  /**
   * Upload profile picture
   */
  async uploadProfilePicture(file: File): Promise<string> {
    this.setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await this.api.post(
        "/api/users/me/profile-picture",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const data: IApiResponse<{ url: string }> = response.data;
      return data.data.url;
    } catch (error: any) {
      this.handleError(error);
      throw error;
    } finally {
      this.setLoading(false);
    }
  }

  /**
   * Get admin users
   */
  async getAdmins(): Promise<IUser[]> {
    return this.getUsersByRole("admin");
  }

  /**
   * Get employees
   */
  async getEmployees(): Promise<IUser[]> {
    return this.getUsersByRole("employee");
  }
}

/**
 * User store using Pinia
 */
export const useUserStore = defineStore("user", () => {
  const store = new UserStoreClass();

  return {
    // State
    items: store.items,
    currentItem: store.currentItem,
    loading: store.loading,
    error: store.error,
    total: store.total,
    page: store.page,
    pageSize: store.pageSize,

    // Getters
    hasItems: store.hasItems,
    hasError: store.hasError,
    isLoading: store.isLoading,
    totalPages: store.totalPages,

    // Actions
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

    // User-specific actions
    getProfile: store.getProfile.bind(store),
    updateProfile: store.updateProfile.bind(store),
    changePassword: store.changePassword.bind(store),
    assignRoles: store.assignRoles.bind(store),
    assignPermissions: store.assignPermissions.bind(store),
    toggleUserStatus: store.toggleUserStatus.bind(store),
    getUsersByRole: store.getUsersByRole.bind(store),
    getUsersWithCars: store.getUsersWithCars.bind(store),
    searchUsers: store.searchUsers.bind(store),
    uploadProfilePicture: store.uploadProfilePicture.bind(store),
    getAdmins: store.getAdmins.bind(store),
    getEmployees: store.getEmployees.bind(store),
  };
});
