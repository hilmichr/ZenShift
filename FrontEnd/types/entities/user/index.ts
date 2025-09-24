// Re-export base entity types
export type {
  IEntity,
  IEntityPatch,
  IEntityWithRelations,
  TPatchablePath,
} from "../../IEntity";

// Export all User-related types
export type {
  IUser,
  IUserPatch,
  IUserWithRelations,
  IUserCreate,
  IUserLogin,
  IUserLoginResponse,
  IUserProfileUpdate,
  IPasswordChange,
  TUserPatchablePath,
  IUserRoleAssignment,
  IUserPermissionAssignment,
} from "./IUser";
