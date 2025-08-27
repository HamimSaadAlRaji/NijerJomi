import React from "react";
import { Link, useLocation } from "react-router-dom";
import AdminNavbarLinks from "./AdminNavbarLinks";
import CitizenNavbarLinks from "./CitizenNavbarLinks";
import { UserRole } from "../../../types";
import { isRole } from "@/lib/roleUtils";

interface DesktopNavigationProps {
  isLoggedIn: boolean;
  user: any;
  isDarkTheme?: boolean;
}

const DesktopNavigation: React.FC<DesktopNavigationProps> = ({
  isLoggedIn,
  user,
  isDarkTheme = false,
}) => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;
  const isLandingPage = location.pathname === "/";
  const isPublicInfoPage = [
    "/why-blockchain",
    "/anti-corruption",
    "/user-benefits",
    "/marketplace",
    "/chain-explorer",
  ].includes(location.pathname);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const linkClasses = (path: string) => {
    const baseClasses =
      "font-medium transition-colors duration-200 hover:scale-105";
    const activeClasses = isActive(path) ? "border-b-2" : "";

    if (isDarkTheme) {
      return `${baseClasses} text-gray-700 hover:text-black border-black ${activeClasses}`;
    }
    return `${baseClasses} text-white hover:text-gray-300 border-white ${activeClasses}`;
  };

  return (
    <div className="hidden md:flex items-center space-x-8">
      {/* Show public navigation links on landing page and public info pages when not logged in */}
      {!isLoggedIn && (isLandingPage || isPublicInfoPage) && (
        <>
          {isPublicInfoPage && (
            <Link to="/" className={linkClasses("/")} onClick={scrollToTop}>
              Home
            </Link>
          )}
          <Link
            to="/marketplace"
            className={linkClasses("/marketplace")}
            onClick={scrollToTop}
          >
            MarketPlace
          </Link>
          <Link
            to="/why-blockchain"
            className={linkClasses("/why-blockchain")}
            onClick={scrollToTop}
          >
            Why Blockchain
          </Link>
          <Link
            to="/anti-corruption"
            className={linkClasses("/anti-corruption")}
            onClick={scrollToTop}
          >
            Fighting Corruption
          </Link>
          <Link
            to="/user-benefits"
            className={linkClasses("/user-benefits")}
            onClick={scrollToTop}
          >
            User Benefits
          </Link>
          <Link
            to="/chain-explorer"
            className={linkClasses("/chain-explorer")}
            onClick={scrollToTop}
          >
            Chain Explorer
          </Link>
        </>
      )}

      {/* Show role-specific navigation if user is logged in */}
      {isLoggedIn && (
        <>
          {isRole(user?.userRole || "", UserRole.ADMIN) ||
          isRole(user?.userRole || "", UserRole.REGISTRAR) ? (
            <AdminNavbarLinks isDarkTheme={isDarkTheme} />
          ) : (
            <CitizenNavbarLinks isDarkTheme={isDarkTheme} />
          )}
        </>
      )}
    </div>
  );
};

export default DesktopNavigation;
