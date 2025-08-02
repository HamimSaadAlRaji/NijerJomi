import { UserRole } from "../../types";
import {
  mapBackendRoleToEnum,
  mapEnumToBackendRole,
  isRole,
} from "./roleUtils";

// Test the role mapping functions
console.log("Testing Role Mapping Functions:");

// Test enum to backend mapping
console.log("\n=== Enum to Backend (for API calls) ===");
console.log("ADMIN ->", mapEnumToBackendRole(UserRole.ADMIN)); // Should be "ADMIN"
console.log("REGISTRAR ->", mapEnumToBackendRole(UserRole.REGISTRAR)); // Should be "REGISTRAR"
console.log("CITIZEN ->", mapEnumToBackendRole(UserRole.CITIZEN)); // Should be "CITIZEN"

// Test backend to enum mapping (both formats)
console.log("\n=== Backend to Enum (from API responses) ===");
console.log('"ADMIN" ->', mapBackendRoleToEnum("ADMIN")); // Should be UserRole.ADMIN
console.log('"admin" ->', mapBackendRoleToEnum("admin")); // Should be UserRole.ADMIN
console.log('"REGISTRAR" ->', mapBackendRoleToEnum("REGISTRAR")); // Should be UserRole.REGISTRAR
console.log('"register" ->', mapBackendRoleToEnum("register")); // Should be UserRole.REGISTRAR

// Test role checking
console.log("\n=== Role Checking ===");
console.log(
  'isRole("ADMIN", UserRole.ADMIN) ->',
  isRole("ADMIN", UserRole.ADMIN)
); // Should be true
console.log(
  'isRole("admin", UserRole.ADMIN) ->',
  isRole("admin", UserRole.ADMIN)
); // Should be true
console.log(
  'isRole("REGISTRAR", UserRole.REGISTRAR) ->',
  isRole("REGISTRAR", UserRole.REGISTRAR)
); // Should be true
console.log(
  'isRole("register", UserRole.REGISTRAR) ->',
  isRole("register", UserRole.REGISTRAR)
); // Should be true
console.log(
  'isRole("CITIZEN", UserRole.ADMIN) ->',
  isRole("CITIZEN", UserRole.ADMIN)
); // Should be false
