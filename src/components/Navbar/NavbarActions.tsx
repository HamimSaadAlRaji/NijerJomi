import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import WalletConnectButton from "../WalletConnectButton";
import { UserRole } from "../../../types";
import { isRole } from "@/lib/roleUtils";

interface NavbarActionsProps {
  isLoggedIn: boolean;
  user: any;
  isDarkTheme?: boolean;
}

const NavbarActions: React.FC<NavbarActionsProps> = ({
  isLoggedIn,
  user,
  isDarkTheme = false,
}) => {
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
          <WalletConnectButton
            size="lg"
            showDropdown={true}
            className={`rounded-full text-xl px-8 py-3 border ${
              isDarkTheme
                ? "bg-[#036428] hover:bg-[#00441b] text-white border-[#238b45]"
                : "bg-white hover:bg-gray-200 text-[#006d2c] border-gray-300"
            }`}
          />
        </>
      ) : (
        <>
          <Link to="/connect-wallet">
            <Button
              size="lg"
              className={`rounded-full text-xl px-8 py-3 border ${
                isDarkTheme
                  ? "bg-[#014b1f] hover:bg-[#038a39] text-white border-[#238b45]"
                  : "bg-white hover:bg-gray-200 text-[#012810] border-gray-300"
              }`}
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
