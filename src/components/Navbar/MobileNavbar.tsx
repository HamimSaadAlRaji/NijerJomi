import React from "react";
import { Link, useLocation } from "react-router-dom";
import { X } from "lucide-react";
import { UserRole } from "../../../types";
import { isRole } from "@/lib/roleUtils";
import WalletConnectButton from "../WalletConnectButton";

interface MobileNavbarProps {
  isOpen: boolean;
  isLoggedIn: boolean;
  user: any;
  setIsOpen: (isOpen: boolean) => void;
  isDarkTheme?: boolean;
}

const MobileNavbar: React.FC<MobileNavbarProps> = ({
  isOpen,
  isLoggedIn,
  user,
  setIsOpen,
  isDarkTheme = false,
}) => {
  const location = useLocation();
  const isLandingPage = location.pathname === "/";
  const isPublicInfoPage = [
    "/why-blockchain",
    "/anti-corruption",
    "/user-benefits",
  ].includes(location.pathname);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!isOpen) return null;

  const linkClasses = `text-xl font-medium transition-colors ${
    isDarkTheme
      ? "text-black hover:text-gray-600"
      : "text-foreground hover:text-primary"
  }`;

  return (
    <div
      className={`md:hidden py-4 border-t animate-slide-up ${
        isDarkTheme ? "border-gray-200" : "border-border"
      }`}
    >
      <div className="flex flex-col space-y-4">
        {isLoggedIn ? (
          <>
            {/* Mobile Navigation Links */}
            <Link
              to="/"
              className={`text-xl font-medium transition-colors ${
                isDarkTheme
                  ? "text-black hover:text-gray-600"
                  : "text-foreground hover:text-primary"
              }`}
              onClick={() => {
                scrollToTop();
                setIsOpen(false);
              }}
            >
              Home
            </Link>

            {isRole(user?.userRole || "", UserRole.ADMIN) ||
            isRole(user?.userRole || "", UserRole.REGISTRAR) ? (
              <>
                {/* Admin/Registrar Mobile Links */}
                <Link
                  to="/admin/dashboard"
                  className={`text-xl font-medium transition-colors ${
                    isDarkTheme
                      ? "text-black hover:text-gray-600"
                      : "text-foreground hover:text-primary"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {isRole(user?.userRole || "", UserRole.ADMIN)
                    ? "Admin Dashboard"
                    : "Registrar Dashboard"}
                </Link>

                {/* Only show these links for ADMIN, not REGISTRAR */}
                {isRole(user?.userRole || "", UserRole.ADMIN) && (
                  <>
                    <Link
                      to="/admin/verify-user"
                      className="text-xl font-medium text-foreground hover:text-primary transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      Verify Users
                    </Link>
                    <Link
                      to="/admin/set-user-role"
                      className="text-xl font-medium text-foreground hover:text-primary transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      Manage Roles
                    </Link>
                  </>
                )}

                <Link
                  to="/admin/property-management"
                  className="text-xl font-medium text-foreground hover:text-primary transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Property Management
                </Link>
                <Link
                  to="/admin/users"
                  className="text-xl font-medium text-foreground hover:text-primary transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Manage Users
                </Link>
                <Link
                  to="/admin/verifications"
                  className="text-xl font-medium text-foreground hover:text-primary transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Verifications
                </Link>
                <Link
                  to="/admin/analytics"
                  className="text-xl font-medium text-foreground hover:text-primary transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Analytics
                </Link>
                <Link
                  to="/admin/settings"
                  className="text-xl font-medium text-foreground hover:text-primary transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  System Settings
                </Link>
                <Link
                  to="/admin/reports"
                  className="text-xl font-medium text-foreground hover:text-primary transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Reports
                </Link>
              </>
            ) : (
              <>
                {/* Citizen/Registrar Mobile Links */}
                <Link
                  to="/properties"
                  className="text-xl font-medium text-foreground hover:text-primary transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Browse Properties
                </Link>
                <Link
                  to="/my-properties"
                  className="text-xl font-medium text-foreground hover:text-primary transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  My Properties
                </Link>
                <Link
                  to="/register"
                  className="text-xl font-medium text-foreground hover:text-primary transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Register Property
                </Link>
                <Link
                  to="/verify"
                  className="text-xl font-medium text-foreground hover:text-primary transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Verify
                </Link>
                <Link
                  to="/support"
                  className="text-xl font-medium text-foreground hover:text-primary transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Support
                </Link>
                <Link
                  to="/dashboard"
                  className="text-xl font-medium text-foreground hover:text-primary transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Dashboard
                </Link>
              </>
            )}

            <div className="pt-4 border-t border-border">
              <WalletConnectButton
                size="lg"
                showDropdown={true}
                className="w-full bg-black hover:bg-gray-800 text-white rounded-full text-xl py-3"
              />
            </div>
          </>
        ) : (
          <>
            {/* Public navigation links for non-logged-in users on public pages */}
            {(isLandingPage || isPublicInfoPage) && (
              <>
                {isPublicInfoPage && (
                  <Link
                    to="/"
                    className={linkClasses}
                    onClick={() => {
                      scrollToTop();
                      setIsOpen(false);
                    }}
                  >
                    Home
                  </Link>
                )}
                <Link
                  to="/marketplace"
                  className={linkClasses}
                  onClick={() => {
                    scrollToTop();
                    setIsOpen(false);
                  }}
                >
                  MarketPlace
                </Link>
                <Link
                  to="/why-blockchain"
                  className={linkClasses}
                  onClick={() => {
                    scrollToTop();
                    setIsOpen(false);
                  }}
                >
                  Why Blockchain
                </Link>
                <Link
                  to="/anti-corruption"
                  className={linkClasses}
                  onClick={() => {
                    scrollToTop();
                    setIsOpen(false);
                  }}
                >
                  Fighting Corruption
                </Link>
                <Link
                  to="/user-benefits"
                  className={linkClasses}
                  onClick={() => {
                    scrollToTop();
                    setIsOpen(false);
                  }}
                >
                  User Benefits
                </Link>
                <div className="pt-4 border-t border-border"></div>
              </>
            )}

            {/* Mobile Connect Wallet Button when not logged in */}
            <div className="text-center">
              <WalletConnectButton
                size="lg"
                className="w-full bg-black hover:bg-gray-800 text-white rounded-full text-xl py-3"
              />
            </div>
            <Link
              to="/connect-wallet"
              className={`text-center ${linkClasses}`}
              onClick={() => setIsOpen(false)}
            >
              Connect Wallet
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default MobileNavbar;
