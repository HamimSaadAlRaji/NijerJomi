import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import WalletConnectButton from "../WalletConnectButton";
import { UserRole } from "../../../types";
import { isRole } from "@/lib/roleUtils";

interface NavbarActionsProps {
  isLoggedIn: boolean;
  user: any;
}

const NavbarActions: React.FC<NavbarActionsProps> = ({ isLoggedIn, user }) => {
  const getDashboardPath = () => {
    return isRole(user?.userRole || "", UserRole.ADMIN)
      ? "/admin/dashboard"
      : "/dashboard";
  };

  const getDashboardText = () => {
    return isRole(user?.userRole || "", UserRole.ADMIN)
      ? "Admin Dashboard"
      : "Dashboard";
  };

  return (
    <div className="hidden md:flex items-center space-x-4">
      {isLoggedIn ? (
        <>
          <Link to={getDashboardPath()}>
            <Button
              variant="ghost"
              className="text-foreground hover:text-primary"
            >
              {getDashboardText()}
            </Button>
          </Link>

          <WalletConnectButton
            size="lg"
            showDropdown={true}
            className="bg-gradient-hero hover:opacity-90 rounded-full text-xl px-8 py-3"
          />
        </>
      ) : (
        <>
          <Link to="/connect-wallet">
            <Button
              size="lg"
              className="rounded-full text-xl px-8 py-3 bg-transparent"
            >
              Connect Wallet
            </Button>
          </Link>
        </>
      )}
    </div>
  );
};

export default NavbarActions;
