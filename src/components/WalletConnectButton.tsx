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

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Single button with different text based on connection status
  if (showDropdown && isConnected && user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            size={size}
            variant={variant}
            className={`bg-gradient-hero hover:opacity-90 rounded-full text-xl px-8 py-3 ${className}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Wallet className="w-4 h-4 mr-2" />
            )}
            {formatAddress(walletAddress!)}
            <ChevronDown className="w-4 h-4 ml-2" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem onClick={handleViewProfile}>
            <User className="w-4 h-4 mr-2" />
            View Profile
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleDisconnect} className="text-red-600">
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
      className={`bg-gradient-hero hover:opacity-90 rounded-full text-xl px-8 py-3 ${className}`}
      disabled={isLoading}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      ) : (
        <Wallet className="w-4 h-4 mr-2" />
      )}
      {isConnected && user
        ? `${formatAddress(walletAddress!)}`
        : "Connect Wallet"}
    </Button>
  );
};

export default WalletConnectButton;
