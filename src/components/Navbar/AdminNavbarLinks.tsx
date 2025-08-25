import React from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useWalletContext } from "@/contexts/WalletContext";
import { UserRole } from "../../../types";
import { isRole } from "@/lib/roleUtils";

interface AdminNavbarLinksProps {
  isDarkTheme?: boolean;
}

const AdminNavbarLinks: React.FC<AdminNavbarLinksProps> = ({
  isDarkTheme = false,
}) => {
  const location = useLocation();
  const { user } = useWalletContext();
  const isActive = (path: string) => location.pathname === path;
  const isAdmin = isRole(user?.userRole || "", UserRole.ADMIN);

  const linkBase = `text-xl font-medium transition-colors`;
  const linkColor = isDarkTheme ? "text-black hover:text-gray-600" : "text-white hover:text-gray-300";

  return (
    <nav className="flex gap-6 items-center">
      <Link
        to="/admin/dashboard"
        className={`${linkBase} ${linkColor} ${["/admin/dashboard", "/dashboard"].includes(location.pathname) ? "underline" : ""}`}
      >
        Dashboard
      </Link>
      <Link
        to="/admin/verify-user"
        className={`${linkBase} ${linkColor} ${isActive("/admin/verify-user") ? "underline" : ""}`}
      >
        Verify Users
      </Link>
      {isAdmin && (
        <Link
          to="/admin/set-user-role"
          className={`${linkBase} ${linkColor} ${isActive("/admin/set-user-role") ? "underline" : ""}`}
        >
          Manage Roles
        </Link>
      )}
      <Link
        to="/admin/property-management"
        className={`${linkBase} ${linkColor} ${isActive("/admin/property-management") ? "underline" : ""}`}
      >
        Property Management
      </Link>
    </nav>
  );
};

export default AdminNavbarLinks;