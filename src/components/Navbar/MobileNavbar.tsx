import React from "react";
import { Link } from "react-router-dom";
import { X } from "lucide-react";
import { UserRole } from "../../../types";
import { isRole } from "@/lib/roleUtils";
import WalletConnectButton from "../WalletConnectButton";

interface MobileNavbarProps {
  isOpen: boolean;
  isLoggedIn: boolean;
  user: any;
  setIsOpen: (isOpen: boolean) => void;
}

const MobileNavbar: React.FC<MobileNavbarProps> = ({
  isOpen,
  isLoggedIn,
  user,
  setIsOpen,
}) => {
  if (!isOpen) return null;

  return (
    <div className="md:hidden py-4 border-t border-border animate-slide-up">
      <div className="flex flex-col space-y-4">
        {isLoggedIn ? (
          <>
            {/* Mobile Navigation Links */}
            <Link
              to="/"
              className="text-xl font-medium text-foreground hover:text-primary transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>

            {isRole(user?.userRole || "", UserRole.ADMIN) ? (
              <>
                {/* Admin Mobile Links */}
                <Link
                  to="/admin/dashboard"
                  className="text-xl font-medium text-foreground hover:text-primary transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Admin Dashboard
                </Link>
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
                  Admin Analytics
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
                className="w-full bg-gradient-hero hover:opacity-90 rounded-full text-xl py-3"
              />
            </div>
          </>
        ) : (
          <>
            {/* Mobile Connect Wallet Button when not logged in */}
            <div className="text-center">
              <WalletConnectButton
                size="lg"
                className="w-full bg-gradient-hero hover:opacity-90 rounded-full text-xl py-3"
              />
            </div>
            <Link
              to="/connect-wallet"
              className="text-xl font-medium text-foreground hover:text-primary transition-colors text-center"
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
