import type {
  IEntity,
  IEntityPatch,
  IEntityWithRelations,
  TPatchablePath,
} from "../../IEntity";

/**
 * Work entry status enum
 */
export type TWorkEntryStatus = "draft" | "pending" | "approved" | "rejected";

/**
 * Work entry entity interface
 */
export interface IWorkEntry extends IEntity {
  userId: string;
  date: string; // ISO date string (YYYY-MM-DD)
  startTime: string; // HH:mm format
  endTime: string; // HH:mm format
  breakMinutes: number;
  durationMinutes: number;
  notes?: string;
  status: TWorkEntryStatus;
  approvedBy?: string;
  approvedAt?: string;
  rejectedBy?: string;
  rejectedAt?: string;
  rejectionReason?: string;
}

/**
 * Work entry patch interface for partial updates
 */
export interface IWorkEntryPatch extends IEntityPatch {
  date?: string;
  startTime?: string;
  endTime?: string;
  breakMinutes?: number;
  notes?: string;
  status?: TWorkEntryStatus;
  approvedBy?: string;
  approvedAt?: string;
  rejectedBy?: string;
  rejectedAt?: string;
  rejectionReason?: string;
}

/**
 * Work entry with relations (includes user data)
 */
export interface IWorkEntryWithRelations
  extends IWorkEntry,
    IEntityWithRelations {
  user?: import("../user/IUser").IUser;
  approver?: import("../user/IUser").IUser;
  rejector?: import("../user/IUser").IUser;
}

/**
 * Work entry creation payload
 */
export interface IWorkEntryCreate {
  date: string;
  startTime: string;
  endTime: string;
  breakMinutes?: number;
  notes?: string;
}

/**
 * Work entry update payload (for own entries)
 */
export interface IWorkEntryUpdate {
  date?: string;
  startTime?: string;
  endTime?: string;
  breakMinutes?: number;
  notes?: string;
}

/**
 * Admin work entry update payload
 */
export interface IWorkEntryAdminUpdate extends IWorkEntryUpdate {
  status?: TWorkEntryStatus;
  rejectionReason?: string;
}

/**
 * Work entry approval payload
 */
export interface IWorkEntryApproval {
  approvedBy: string;
  notes?: string;
}

/**
 * Work entry rejection payload
 */
export interface IWorkEntryRejection {
  rejectedBy: string;
  rejectionReason: string;
}

/**
 * Bulk work entry action payload
 */
export interface IWorkEntryBulkAction {
  entryIds: string[];
  actionBy: string;
  notes?: string;
  rejectionReason?: string; // Only for bulk rejection
}

/**
 * Work entry filter options
 */
export interface IWorkEntryFilter {
  userId?: string;
  dateFrom?: string;
  dateTo?: string;
  status?: TWorkEntryStatus;
  approvedBy?: string;
  page?: number;
  pageSize?: number;
  sortBy?: "date" | "createdAt" | "status" | "duration";
  sortOrder?: "asc" | "desc";
}

/**
 * Work entry statistics
 */
export interface IWorkEntryStatistics {
  totalEntries: number;
  pendingEntries: number;
  approvedEntries: number;
  rejectedEntries: number;
  totalHours: number;
  averageHoursPerDay: number;
  averageHoursPerWeek: number;
  currentWeekHours: number;
  currentMonthHours: number;
}

/**
 * Work entry export options
 */
export interface IWorkEntryExportOptions {
  format: "xlsx" | "csv" | "pdf";
  dateFrom?: string;
  dateTo?: string;
  userId?: string;
  status?: TWorkEntryStatus;
  includeNotes?: boolean;
  includeApprovalInfo?: boolean;
}

/**
 * Patchable paths type for WorkEntry
 */
export type TWorkEntryPatchablePath = TPatchablePath<IWorkEntry>;
