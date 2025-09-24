// Re-export base entity types
export type {
  IEntity,
  IEntityPatch,
  IEntityWithRelations,
  TPatchablePath,
} from "../../IEntity";

// Export all VacationRequest-related types
export type {
  TVacationRequestStatus,
  TVacationRequestType,
  IVacationRequest,
  IVacationRequestPatch,
  IVacationRequestWithRelations,
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
  TVacationRequestPatchablePath,
} from "./IVacationRequest";
