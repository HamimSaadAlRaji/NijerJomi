import React from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface CitizenNavbarLinksProps {
  isDarkTheme?: boolean;
}

const CitizenNavbarLinks: React.FC<CitizenNavbarLinksProps> = ({
  isDarkTheme = false,
}) => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          className={`flex items-center space-x-1 text-xl font-medium transition-colors ${
            isDarkTheme
              ? "text-black hover:text-gray-600"
              : "text-white hover:text-gray-300"
          }`}
        >
          <span>Properties</span>
          <ChevronDown className="w-4 h-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem asChild>
            <Link to="/properties">Browse Properties</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/my-properties">My Properties</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/transfer-management">Transfer Management</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/analytics">Market Analytics</Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Link
        to="/register"
        className={`text-xl font-medium transition-colors hover:text-gray-300 ${
          isActive("/register") ? "text-white" : "text-white"
        }`}
      >
        Register Property
      </Link>
    </>
  );
};

export default CitizenNavbarLinks;
