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

  const linkBase = `text-xl font-medium transition-colors`;
  const linkColor = "text-white hover:text-blue-200";

  return (
    <nav className="flex gap-6 items-center">
      <Link
        to="/marketplace"
        className={`${linkBase} ${linkColor} ${
          ["/marketplace", "/dashboard"].includes(location.pathname)
            ? "underline"
            : ""
        }`}
      >
        MarketPlace
      </Link>
      <Link
        to="/my-properties"
        className={`${linkBase} ${linkColor} ${
          isActive("/my-properties") ? "underline" : ""
        }`}
      >
        My Properties
      </Link>
      <Link
        to="/transfer-management"
        className={`${linkBase} ${linkColor} ${
          isActive("/transfer-management") ? "underline" : ""
        }`}
      >
        Transfer Management
      </Link>
    </nav>
  );
};

export default CitizenNavbarLinks;
