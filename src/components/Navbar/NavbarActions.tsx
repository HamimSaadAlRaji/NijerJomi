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
            <Button variant="ghost" className="text-white hover:text-gray-300">
              {getDashboardText()}
            </Button>
          </Link>

          <WalletConnectButton
            size="lg"
            showDropdown={true}
            className="bg-white hover:bg-gray-200 text-black rounded-full text-xl px-8 py-3 border border-gray-300"
          />
        </>
      ) : (
        <>
          <Link to="/connect-wallet">
            <Button
              size="lg"
              className="rounded-full text-xl px-8 py-3 bg-white hover:bg-gray-200 text-black border border-gray-300"
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
