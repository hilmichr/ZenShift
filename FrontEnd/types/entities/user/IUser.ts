import type {
  IEntity,
  IEntityPatch,
  IEntityWithRelations,
  TPatchablePath,
} from "../../IEntity";

/**
 * User entity interface
 */
export interface IUser extends IEntity {
  email: string;
  fullName: string;
  phone?: string;
  homeAddress?: string;
  latitude?: number;
  longitude?: number;
  hasCar: boolean;
  showAddressPublic: boolean;
  roles: string[];
  permissions: string[];
  isActive: boolean;
  lastLogin?: string;
  profilePicture?: string;
}

/**
 * User patch interface for partial updates
 */
export interface IUserPatch extends IEntityPatch {
  email?: string;
  fullName?: string;
  phone?: string;
  homeAddress?: string;
  latitude?: number;
  longitude?: number;
  hasCar?: boolean;
  showAddressPublic?: boolean;
  roles?: string[];
  permissions?: string[];
  isActive?: boolean;
  profilePicture?: string;
}

/**
 * User with relations (includes related data)
 */
export interface IUserWithRelations extends IUser, IEntityWithRelations {
  workEntries?: import("../work-entry/IWorkEntry").IWorkEntry[];
  vacationRequests?: import("../vacation-request/IVacationRequest").IVacationRequest[];
  managedEmployees?: IUser[];
}

/**
 * User creation payload
 */
export interface IUserCreate {
  email: string;
  fullName: string;
  password: string;
  phone?: string;
  homeAddress?: string;
  latitude?: number;
  longitude?: number;
  hasCar?: boolean;
  showAddressPublic?: boolean;
  roles?: string[];
}

/**
 * User login payload
 */
export interface IUserLogin {
  email: string;
  password: string;
}

/**
 * User login response
 */
export interface IUserLoginResponse {
  user: IUser;
  token: string;
  refreshToken?: string;
  expiresIn: number;
}

/**
 * User profile update payload
 */
export interface IUserProfileUpdate {
  fullName?: string;
  phone?: string;
  homeAddress?: string;
  latitude?: number;
  longitude?: number;
  hasCar?: boolean;
  showAddressPublic?: boolean;
  profilePicture?: string;
}

/**
 * Password change payload
 */
export interface IPasswordChange {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

/**
 * Patchable paths type for User
 */
export type TUserPatchablePath = TPatchablePath<IUser>;

/**
 * User role assignment payload
 */
export interface IUserRoleAssignment {
  userId: string;
  roles: string[];
  grantedBy: string;
}

/**
 * User permission assignment payload
 */
export interface IUserPermissionAssignment {
  userId: string;
  permissions: string[];
  grantedBy: string;
}
