import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useWalletContext } from "@/contexts/WalletContext";
import { UserRole } from "../../types";
import { isRole } from "@/lib/roleUtils";
import { Loader2, Wallet, ChevronDown, User, LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

interface WalletConnectButtonProps {
  size?: "sm" | "lg" | "default";
  className?: string;
  variant?:
    | "default"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | "destructive";
  showDropdown?: boolean;
}

interface UserData {
  _id: string;
  walletAddress: string;
  fullName: string;
  nidNumber: string;
  phoneNumber: string;
  presentAddress: string;
  permanentAddress: string;
  isVerified: boolean;
  status: "pending" | "accepted" | "rejected";
  userRole:
    | "ADMIN"
    | "REGISTRAR"
    | "CITIZEN"
    | "admin"
    | "register"
    | "citizen"; // Support both formats
  createdAt: string;
  updatedAt: string;
  profilePicture?: string;
}

const WalletConnectButton: React.FC<WalletConnectButtonProps> = ({
  size = "lg",
  className = "",
  variant = "default",
  showDropdown = false,
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const {
    isConnected,
    walletAddress,
    user,
    isLoading,
    error,
    connectWallet,
    disconnectWallet,
    isMetaMaskInstalled,
  } = useWalletContext();

  const handleWalletAction = async () => {
    // If wallet is connected and user exists, go to appropriate dashboard
    if (isConnected && user) {
      if (isRole(user.userRole || "", UserRole.ADMIN)) {
        navigate("/admin/dashboard");
      } else {
        navigate("/dashboard");
      }
      return;
    }

    // If not connected, try to connect
    if (!isConnected) {
      // Check if MetaMask is installed
      if (!isMetaMaskInstalled()) {
        toast({
          title: "MetaMask Not Found",
          description: "Please install MetaMask to connect your wallet.",
          variant: "destructive",
        });
        // Open MetaMask website
        window.open("https://metamask.io/download/", "_blank");
        return;
      }

      // Connect wallet
      const result = await connectWallet();

      if (result) {
        if (result.userExists) {
          // User exists in database - wallet connected and data retrieved
          toast({
            title: "Wallet Connected",
            description: `Welcome back! Connected to ${result.walletAddress.slice(
              0,
              6
            )}...${result.walletAddress.slice(-4)}`,
          });

          // Navigate based on user role
          if (
            result.userData &&
            isRole(result.userData.userRole || "", UserRole.ADMIN)
          ) {
            navigate("/admin/dashboard");
          } else {
            navigate("/dashboard");
          }
        } else {
          // New wallet - not in database, needs registration
          toast({
            title: "New Wallet Detected",
            description: "Please complete your registration to continue.",
          });
          navigate("/user-verification");
        }
      } else if (error) {
        toast({
          title: "Connection Failed",
          description: error,
          variant: "destructive",
        });
      }
    }
  };

  const handleDisconnect = () => {
    disconnectWallet();
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected successfully.",
    });
    navigate("/");
  };

  const handleViewProfile = () => {
    if (walletAddress) {
      navigate(`/profile/${walletAddress}`);
    }
  };

  // Helper for user photo (fallback to avatar)
  const getUserPhoto = () => {
    if (user && user.profilePicture) {
      return user.profilePicture;
    }
    // fallback avatar
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.fullName || "User")}&background=0D8ABC&color=fff&size=128`;
  };

  // Single button with different text based on connection status
  if (showDropdown && isConnected && user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            size={size}
            variant={variant}
            className={`rounded-full text-xl flex items-center gap-3 ${className}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <img
                src={getUserPhoto()}
                alt={user?.fullName || "User"}
                className="w-10 h-10 rounded-full object-cover mr-2 border-2 border-blue-400"
              />
            )}
            <span className="flex flex-col items-start">
              <span className="font-bold text-base leading-tight">{user?.fullName || "User"}</span>
              <span className="text-xs text-blue-700 dark:text-blue-400 font-medium">{user?.userRole || "Citizen"}</span>
            </span>
            <ChevronDown className="w-4 h-4 ml-2" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem onClick={handleViewProfile}>
            <User className="w-4 h-4 mr-2" />
            View Profile
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={handleDisconnect}
            className="text-destructive-foreground"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Disconnect Wallet
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <Button
      onClick={handleWalletAction}
      size={size}
      variant={variant}
      className={`rounded-full text-xl flex items-center gap-3 ${className}`}
      disabled={isLoading}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      ) : isConnected && user ? (
        <>
          <img
            src={getUserPhoto()}
            alt={user?.fullName || "User"}
            className="w-10 h-10 rounded-full object-cover mr-2 border-2 border-blue-400"
          />
          <div className="flex flex-col items-center justify-center">
            <div className="font-bold text-base leading-tight">{user?.fullName || "User"}</div>
            <div className="text-xs text-blue-700 dark:text-blue-400 font-medium">{user?.userRole || "Citizen"}</div>
          </div>
        </>
      ) : (
        <Wallet className="w-4 h-4 mr-2" />
      )}
      {(!isConnected || !user) && "Connect Wallet"}
    </Button>
  );
};

export default WalletConnectButton;
