import React from "react";
import { Link, useLocation } from "react-router-dom";
import AdminNavbarLinks from "./AdminNavbarLinks";
import CitizenNavbarLinks from "./CitizenNavbarLinks";
import { UserRole } from "../../../types";
import { isRole } from "@/lib/roleUtils";

interface DesktopNavigationProps {
  isLoggedIn: boolean;
  user: any;
}

const DesktopNavigation: React.FC<DesktopNavigationProps> = ({
  isLoggedIn,
  user,
}) => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="hidden md:flex items-center space-x-8">
      {/* Show role-specific navigation if user is logged in */}
      {isLoggedIn && (
        <>
          {isRole(user?.userRole || "", UserRole.ADMIN) ||
          isRole(user?.userRole || "", UserRole.REGISTRAR) ? (
            <AdminNavbarLinks />
          ) : (
            <CitizenNavbarLinks />
          )}
        </>
      )}
    </div>
  );
};

export default DesktopNavigation;
