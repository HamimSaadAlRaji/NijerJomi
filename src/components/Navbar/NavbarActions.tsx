import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import WalletConnectButton from "../WalletConnectButton";

interface NavbarActionsProps {
  isLoggedIn: boolean;
  user: any;
}

const NavbarActions: React.FC<NavbarActionsProps> = ({ isLoggedIn, user }) => {
  const getDashboardLink = () => {
    return user?.userRole === "admin" ? "/admin/dashboard" : "/dashboard";
  };

  const getDashboardText = () => {
    return user?.userRole === "admin" ? "Admin Dashboard" : "Dashboard";
  };

  return (
    <div className="hidden md:flex items-center space-x-4">
      {isLoggedIn ? (
        <>
          <Link to={getDashboardLink()}>
            <Button
              variant="outline"
              size="lg"
              className="rounded-full text-xl px-8 py-3"
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
