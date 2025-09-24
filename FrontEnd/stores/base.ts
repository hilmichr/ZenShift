import type {
  IEntity,
  IApiResponse,
  IPaginatedResponse,
  IApiError,
} from "~/types";

/**
 * Base store class that provides common functionality for all entity stores
 */
export abstract class BaseEntityStore<
  TEntity extends IEntity,
  TCreate = Partial<TEntity>,
  TUpdate = Partial<TEntity>,
  TFilter = Record<string, any>
> {
  protected baseUrl: string;
  protected entityName: string;

  // State
  public items = ref<TEntity[]>([]);
  public currentItem = ref<TEntity | null>(null);
  public loading = ref(false);
  public error = ref<string | null>(null);
  public total = ref(0);
  public page = ref(1);
  public pageSize = ref(10);

  constructor(baseUrl: string, entityName: string) {
    this.baseUrl = baseUrl;
    this.entityName = entityName;
  }

  /**
   * Get API instance
   */
  protected get api() {
    const { $api } = useNuxtApp() as unknown as { $api: any };
    return $api;
  }

  /**
   * Handle API errors
   */
  protected handleError(error: any): void {
    console.error(`${this.entityName} store error:`, error);
    this.error.value =
      error.response?.data?.message || error.message || "An error occurred";
  }

  /**
   * Set loading state
   */
  protected setLoading(loading: boolean): void {
    this.loading.value = loading;
    if (loading) {
      this.error.value = null;
    }
  }

  /**
   * Get all items with optional filtering and pagination
   */
  async getAll(filter?: TFilter): Promise<TEntity[]> {
    this.setLoading(true);
    try {
      const params = {
        page: this.page.value,
        pageSize: this.pageSize.value,
        ...filter,
      };

      const response = await this.api.get(this.baseUrl, { params });
      const data: IPaginatedResponse<TEntity> = response.data;

      this.items.value = data.data;
      this.total.value = data.total;
      this.page.value = data.page;
      this.pageSize.value = data.pageSize;

      return data.data;
    } catch (error: any) {
      this.handleError(error);
      throw error;
    } finally {
      this.setLoading(false);
    }
  }

  /**
   * Get item by ID
   */
  async getById(id: string): Promise<TEntity> {
    this.setLoading(true);
    try {
      const response = await this.api.get(`${this.baseUrl}/${id}`);
      const data: IApiResponse<TEntity> = response.data;

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
   * Create new item
   */
  async create(payload: TCreate): Promise<TEntity> {
    this.setLoading(true);
    try {
      const response = await this.api.post(this.baseUrl, payload);
      const data: IApiResponse<TEntity> = response.data;

      // Add to local items if not paginated or on first page
      if (this.page.value === 1) {
        this.items.value.unshift(data.data);
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
   * Update item by ID
   */
  async update(id: string, payload: TUpdate): Promise<TEntity> {
    this.setLoading(true);
    try {
      const response = await this.api.put(`${this.baseUrl}/${id}`, payload);
      const data: IApiResponse<TEntity> = response.data;

      // Update in local items
      const index = this.items.value.findIndex((item) => item.id === id);
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
   * Patch item by ID
   */
  async patch(id: string, payload: Partial<TUpdate>): Promise<TEntity> {
    this.setLoading(true);
    try {
      const response = await this.api.patch(`${this.baseUrl}/${id}`, payload);
      const data: IApiResponse<TEntity> = response.data;

      // Update in local items
      const index = this.items.value.findIndex((item) => item.id === id);
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
   * Delete item by ID
   */
  async delete(id: string): Promise<void> {
    this.setLoading(true);
    try {
      await this.api.delete(`${this.baseUrl}/${id}`);

      // Remove from local items
      this.items.value = this.items.value.filter((item) => item.id !== id);

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
   * Refresh data
   */
  async refresh(filter?: TFilter): Promise<void> {
    await this.getAll(filter);
  }

  /**
   * Clear current item
   */
  clearCurrentItem(): void {
    this.currentItem.value = null;
  }

  /**
   * Clear all items
   */
  clearItems(): void {
    this.items.value = [];
    this.total.value = 0;
  }

  /**
   * Clear error
   */
  clearError(): void {
    this.error.value = null;
  }

  /**
   * Set page
   */
  setPage(page: number): void {
    this.page.value = page;
  }

  /**
   * Set page size
   */
  setPageSize(pageSize: number): void {
    this.pageSize.value = pageSize;
  }

  /**
   * Get computed states
   */
  get hasItems(): ComputedRef<boolean> {
    return computed(() => this.items.value.length > 0);
  }

  get hasError(): ComputedRef<boolean> {
    return computed(() => this.error.value !== null);
  }

  get isLoading(): ComputedRef<boolean> {
    return computed(() => this.loading.value);
  }

  get totalPages(): ComputedRef<number> {
    return computed(() => Math.ceil(this.total.value / this.pageSize.value));
  }
}
