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

const AdminNavbarLinks: React.FC = () => {
  const location = useLocation();
  const { user } = useWalletContext();
  const isActive = (path: string) => location.pathname === path;
  const isAdmin = isRole(user?.userRole || "", UserRole.ADMIN);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center space-x-1 text-xl font-medium text-foreground hover:text-primary transition-colors">
          <span>{isAdmin ? "Admin Panel" : "Registrar Panel"}</span>
          <ChevronDown className="w-4 h-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem asChild>
            <Link to="/admin/dashboard">Dashboard</Link>
          </DropdownMenuItem>

          {/* Only show these for ADMIN users */}
          {isAdmin && (
            <>
              <DropdownMenuItem asChild>
                <Link to="/admin/verify-user">Verify Users</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/admin/set-user-role">Manage Roles</Link>
              </DropdownMenuItem>
            </>
          )}

          <DropdownMenuItem asChild>
            <Link to="/admin/property-management">Property Management</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/admin/users">Manage Users</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/admin/verifications">Verifications</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/admin/analytics">
              {isAdmin ? "Admin" : "Registrar"} Analytics
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/admin/settings">System Settings</Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Link
        to="/admin/reports"
        className={`text-xl font-medium transition-colors hover:text-primary ${
          isActive("/admin/reports") ? "text-primary" : "text-foreground"
        }`}
      >
        Reports
      </Link>
    </>
  );
};

export default AdminNavbarLinks;
