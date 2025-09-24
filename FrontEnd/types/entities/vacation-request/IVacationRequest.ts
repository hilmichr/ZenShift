import type {
  IEntity,
  IEntityPatch,
  IEntityWithRelations,
  TPatchablePath,
} from "../../IEntity";

/**
 * Vacation request status enum
 */
export type TVacationRequestStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "cancelled";

/**
 * Vacation request type enum
 */
export type TVacationRequestType =
  | "annual"
  | "sick"
  | "personal"
  | "training"
  | "maternity"
  | "paternity"
  | "other";

/**
 * Vacation request entity interface
 */
export interface IVacationRequest extends IEntity {
  userId: string;
  type: TVacationRequestType;
  startDate: string; // ISO date string (YYYY-MM-DD)
  endDate: string; // ISO date string (YYYY-MM-DD)
  dayCount: number;
  reason?: string;
  status: TVacationRequestStatus;
  approvedBy?: string;
  approvedAt?: string;
  rejectedBy?: string;
  rejectedAt?: string;
  rejectionReason?: string;
  cancelledAt?: string;
  cancelledBy?: string;
  cancellationReason?: string;
  attachments?: string[]; // File paths or URLs
  emergencyContact?: string;
  emergencyPhone?: string;
}

/**
 * Vacation request patch interface for partial updates
 */
export interface IVacationRequestPatch extends IEntityPatch {
  type?: TVacationRequestType;
  startDate?: string;
  endDate?: string;
  dayCount?: number;
  reason?: string;
  status?: TVacationRequestStatus;
  approvedBy?: string;
  approvedAt?: string;
  rejectedBy?: string;
  rejectedAt?: string;
  rejectionReason?: string;
  cancelledAt?: string;
  cancelledBy?: string;
  cancellationReason?: string;
  attachments?: string[];
  emergencyContact?: string;
  emergencyPhone?: string;
}

/**
 * Vacation request with relations (includes user data)
 */
export interface IVacationRequestWithRelations
  extends IVacationRequest,
    IEntityWithRelations {
  user?: import("../user/IUser").IUser;
  approver?: import("../user/IUser").IUser;
  rejector?: import("../user/IUser").IUser;
  canceller?: import("../user/IUser").IUser;
  conflictingRequests?: IVacationRequest[];
}

/**
 * Vacation request creation payload
 */
export interface IVacationRequestCreate {
  type: TVacationRequestType;
  startDate: string;
  endDate: string;
  reason?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  attachments?: File[];
}

/**
 * Vacation request update payload (for own requests)
 */
export interface IVacationRequestUpdate {
  type?: TVacationRequestType;
  startDate?: string;
  endDate?: string;
  reason?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  attachments?: File[];
}

/**
 * Admin vacation request update payload
 */
export interface IVacationRequestAdminUpdate extends IVacationRequestUpdate {
  status?: TVacationRequestStatus;
  rejectionReason?: string;
}

/**
 * Vacation request approval payload
 */
export interface IVacationRequestApproval {
  approvedBy: string;
  notes?: string;
}

/**
 * Vacation request rejection payload
 */
export interface IVacationRequestRejection {
  rejectedBy: string;
  rejectionReason: string;
}

/**
 * Vacation request cancellation payload
 */
export interface IVacationRequestCancellation {
  cancelledBy: string;
  cancellationReason: string;
}

/**
 * Vacation request filter options
 */
export interface IVacationRequestFilter {
  userId?: string;
  type?: TVacationRequestType;
  status?: TVacationRequestStatus;
  dateFrom?: string;
  dateTo?: string;
  approvedBy?: string;
  page?: number;
  pageSize?: number;
  sortBy?: "startDate" | "createdAt" | "status" | "type";
  sortOrder?: "asc" | "desc";
}

/**
 * Vacation balance information
 */
export interface IVacationBalance {
  userId: string;
  year: number;
  totalDays: number;
  usedDays: number;
  pendingDays: number;
  remainingDays: number;
  carryOverDays: number;
  expirationDate?: string;
}

/**
 * Vacation conflict information
 */
export interface IVacationConflict {
  requestId: string;
  conflictingRequestIds: string[];
  conflictType: "overlap" | "same_period" | "team_capacity";
  severity: "low" | "medium" | "high";
  description: string;
  affectedUsers: string[];
}

/**
 * Vacation calendar event
 */
export interface IVacationCalendarEvent {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  type: TVacationRequestType;
  startDate: string;
  endDate: string;
  status: TVacationRequestStatus;
  title: string;
  color: string;
}

/**
 * Vacation statistics
 */
export interface IVacationStatistics {
  totalRequests: number;
  pendingRequests: number;
  approvedRequests: number;
  rejectedRequests: number;
  currentlyOnVacation: number;
  upcomingVacations: number;
  averageVacationDays: number;
  conflictCount: number;
  mostPopularType: TVacationRequestType;
}

/**
 * Vacation export options
 */
export interface IVacationExportOptions {
  format: "xlsx" | "csv" | "pdf" | "ical";
  dateFrom?: string;
  dateTo?: string;
  userId?: string;
  type?: TVacationRequestType;
  status?: TVacationRequestStatus;
  includeApprovalInfo?: boolean;
  includeAttachments?: boolean;
}

/**
 * Patchable paths type for VacationRequest
 */
export type TVacationRequestPatchablePath = TPatchablePath<IVacationRequest>;
