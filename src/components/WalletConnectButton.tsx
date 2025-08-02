import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useWalletContext } from "@/contexts/WalletContext";
import { Loader2, Wallet } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
}

const WalletConnectButton: React.FC<WalletConnectButtonProps> = ({
  size = "lg",
  className = "",
  variant = "default",
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
    // If wallet is connected and user exists, go to dashboard
    if (isConnected && user) {
      navigate("/dashboard");
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
          navigate("/dashboard");
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

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Single button with different text based on connection status
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
        ? `Dashboard - ${formatAddress(walletAddress!)}`
        : "Connect Wallet"}
    </Button>
  );
};

export default WalletConnectButton;
