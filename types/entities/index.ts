// Re-export base entity types
export type {
  IEntity,
  IEntityPatch,
  IEntityWithRelations,
  TPatchablePath,
  IApiResponse,
  IPaginatedResponse,
  IApiError,
} from "../IEntity";

// Re-export all entity types
export * from "./user";
export * from "./work-entry";
export * from "./vacation-request";
