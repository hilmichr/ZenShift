/**
 * Base Entity interface that all entities should extend
 */
export interface IEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Base Entity Patch interface for partial updates
 */
export interface IEntityPatch {
  id?: string;
  updatedAt?: string;
}

/**
 * Base Entity with Relations interface
 */
export interface IEntityWithRelations extends IEntity {
  // Can be extended by specific entities to include relations
}

/**
 * Generic type for patchable paths of an entity
 */
export type TPatchablePath<T> = {
  [K in keyof T]?: T[K] extends object ? TPatchablePath<T[K]> : T[K];
};

/**
 * Common API response structure
 */
export interface IApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

/**
 * Paginated API response
 */
export interface IPaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/**
 * API Error response
 */
export interface IApiError {
  error: string;
  message: string;
  statusCode: number;
  details?: Record<string, any>;
}
