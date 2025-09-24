// Re-export base entity types
export type {
  IEntity,
  IEntityPatch,
  IEntityWithRelations,
  TPatchablePath,
} from "../../IEntity";

// Export all WorkEntry-related types
export type {
  TWorkEntryStatus,
  IWorkEntry,
  IWorkEntryPatch,
  IWorkEntryWithRelations,
  IWorkEntryCreate,
  IWorkEntryUpdate,
  IWorkEntryAdminUpdate,
  IWorkEntryApproval,
  IWorkEntryRejection,
  IWorkEntryBulkAction,
  IWorkEntryFilter,
  IWorkEntryStatistics,
  IWorkEntryExportOptions,
  TWorkEntryPatchablePath,
} from "./IWorkEntry";
