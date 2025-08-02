import { UserRole } from "../../types";

/**
 * Maps backend role strings to frontend UserRole enum values
 */
export const mapBackendRoleToEnum = (backendRole: string): UserRole => {
  switch (backendRole?.toUpperCase()) {
    case "ADMIN":
      return UserRole.ADMIN;
    case "REGISTRAR":
    case "REGISTER": // Handle legacy format
      return UserRole.REGISTRAR;
    case "COURT":
      return UserRole.COURT;
    case "TAX_AUTHORITY":
      return UserRole.TAX_AUTHORITY;
    case "CITIZEN":
      return UserRole.CITIZEN;
    default:
      return UserRole.NONE;
  }
};

/**
 * Maps frontend UserRole enum to backend role strings
 */
export const mapEnumToBackendRole = (enumRole: UserRole): string => {
  switch (enumRole) {
    case UserRole.ADMIN:
      return "ADMIN";
    case UserRole.REGISTRAR:
      return "REGISTRAR";
    case UserRole.COURT:
      return "COURT";
    case UserRole.TAX_AUTHORITY:
      return "TAX_AUTHORITY";
    case UserRole.CITIZEN:
      return "CITIZEN";
    default:
      return "CITIZEN";
  }
};

/**
 * Checks if a backend role matches a frontend enum role
 */
export const isRole = (backendRole: string, enumRole: UserRole): boolean => {
  return mapBackendRoleToEnum(backendRole) === enumRole;
};
