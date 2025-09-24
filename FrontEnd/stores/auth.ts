import { defineStore } from "pinia";

export interface User {
  id: string;
  email: string;
  fullName: string;
  roles: string[];
  permissions: string[];
  // Remove any direct admin boolean to prevent manipulation
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

export const useAuthStore = defineStore("auth", {
  state: (): AuthState => ({
    user: null,
    token: null,
    isAuthenticated: false,
  }),

  getters: {
    // Secure admin check: verify role on server side
    isAdmin: (state) => {
      // Check if user has admin role - this should be verified server-side
      return state.user?.roles?.includes("admin") || false;
    },

    // Check for specific permissions
    hasPermission: (state) => {
      return (permission: string) => {
        return state.user?.permissions?.includes(permission) || false;
      };
    },

    // Check for specific roles
    hasRole: (state) => {
      return (role: string) => {
        return state.user?.roles?.includes(role) || false;
      };
    },

    // Check multiple permissions (all required)
    hasAllPermissions: (state) => {
      return (permissions: string[]) => {
        if (!state.user?.permissions) return false;
        return permissions.every((permission) =>
          state.user!.permissions.includes(permission)
        );
      };
    },

    // Check multiple permissions (any required)
    hasAnyPermission: (state) => {
      return (permissions: string[]) => {
        if (!state.user?.permissions) return false;
        return permissions.some((permission) =>
          state.user!.permissions.includes(permission)
        );
      };
    },
  },

  actions: {
    async login(credentials: { email: string; password: string }) {
      try {
        const { $api } = useNuxtApp() as unknown as { $api: any };

        // Send credentials to secure login endpoint
        const response = await $api.post("/api/auth/login", credentials);

        const { user, token } = response.data;

        // Store the JWT token
        this.token = token;
        this.user = user;
        this.isAuthenticated = true;

        // Store token in secure httpOnly cookie (server-side should set this)
        // Or localStorage for demo purposes (less secure)
        if (process.client) {
          localStorage.setItem("auth_token", token);
        }

        return { success: true, user };
      } catch (error: any) {
        console.error("Login failed:", error);
        return {
          success: false,
          error: error.response?.data?.message || "Login fehlgeschlagen",
        };
      }
    },

    async logout() {
      try {
        const { $api } = useNuxtApp() as unknown as { $api: any };

        // Notify server of logout
        if (this.token) {
          await $api.post("/api/auth/logout");
        }
      } catch (error) {
        console.error("Logout error:", error);
      } finally {
        // Clear local state regardless of server response
        this.user = null;
        this.token = null;
        this.isAuthenticated = false;

        if (process.client) {
          localStorage.removeItem("auth_token");
        }

        // Redirect to login
        await navigateTo("/login");
      }
    },

    async fetchUserProfile() {
      try {
        const { $api } = useNuxtApp() as unknown as { $api: any };

        // Fetch fresh user data from server (including roles/permissions)
        const response = await $api.get("/api/auth/me");

        this.user = response.data;
        return this.user;
      } catch (error: any) {
        console.error("Failed to fetch user profile:", error);

        // If unauthorized, clear auth state
        if (error.response?.status === 401) {
          await this.logout();
        }

        throw error;
      }
    },

    async initializeAuth() {
      if (process.client) {
        const token = localStorage.getItem("auth_token");

        if (token) {
          this.token = token;

          try {
            // Verify token and get user data
            await this.fetchUserProfile();
            this.isAuthenticated = true;
          } catch (error) {
            // Token is invalid, clear it
            localStorage.removeItem("auth_token");
            this.token = null;
            this.isAuthenticated = false;
          }
        }
      }
    },

    // Verify admin status with server
    async verifyAdminAccess(): Promise<boolean> {
      try {
        const { $api } = useNuxtApp() as unknown as { $api: any };

        // Server-side verification of admin access
        const response = await $api.get("/api/auth/verify-admin");

        return response.data.isAdmin === true;
      } catch (error: any) {
        console.error("Admin verification failed:", error);

        // If verification fails, assume not admin
        return false;
      }
    },

    // Check specific permission with server verification
    async verifyPermission(permission: string): Promise<boolean> {
      try {
        const { $api } = useNuxtApp() as unknown as { $api: any };

        const response = await $api.post("/api/auth/verify-permission", {
          permission,
        });

        return response.data.hasPermission === true;
      } catch (error: any) {
        console.error("Permission verification failed:", error);
        return false;
      }
    },
  },
});

// Auto-initialization is now handled in the plugin
