import { useState, useEffect } from "react";
import { walletAPI } from "../services/walletAPI";

// Extend Window interface to include ethereum
declare global {
  interface Window {
    ethereum?: any;
  }
}

export interface User {
  id: string;
  walletAddress: string;
  fullName?: string;
  nidNumber?: string;
  phoneNumber?: string;
  presentAddress?: string;
  permanentAddress?: string;
  profilePicture?: string;
  status?: string;
  userRole?: string;
  submittedAt?: string;
}

export interface WalletState {
  isConnected: boolean;
  walletAddress: string | null;
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

export const useWallet = () => {
  const [walletState, setWalletState] = useState<WalletState>({
    isConnected: false,
    walletAddress: null,
    user: null,
    isLoading: false,
    error: null,
  });

  // Check if MetaMask is installed
  const isMetaMaskInstalled = () => {
    return (
      typeof window !== "undefined" && typeof window.ethereum !== "undefined"
    );
  };

  // Connect to MetaMask
  const connectWallet = async () => {
    if (!isMetaMaskInstalled()) {
      setWalletState((prev) => ({
        ...prev,
        error:
          "MetaMask is not installed. Please install MetaMask to continue.",
      }));
      return null;
    }

    try {
      setWalletState((prev) => ({ ...prev, isLoading: true, error: null }));

      // Request account access
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      if (accounts.length === 0) {
        throw new Error("No accounts found");
      }

      const walletAddress = accounts[0];

      // Call backend API to check if user exists
      const data = await walletAPI.connectWallet(walletAddress);

      if (!data.success) {
        throw new Error(data.message);
      }

      setWalletState((prev) => ({
        ...prev,
        isConnected: true,
        walletAddress: walletAddress,
        user: data.userExists ? data.data : null,
        isLoading: false,
      }));

      return {
        walletAddress,
        userExists: data.userExists,
        userData: data.userExists ? data.data : null,
      };
    } catch (error: any) {
      setWalletState((prev) => ({
        ...prev,
        isLoading: false,
        error: error.message,
      }));
      return null;
    }
  };

  // Disconnect wallet
  const disconnectWallet = () => {
    setWalletState({
      isConnected: false,
      walletAddress: null,
      user: null,
      isLoading: false,
      error: null,
    });
  };

  // Check if wallet is already connected on component mount
  useEffect(() => {
    const checkConnection = async () => {
      if (isMetaMaskInstalled()) {
        try {
          const accounts = await window.ethereum.request({
            method: "eth_accounts",
          });

          if (accounts.length > 0) {
            const walletAddress = accounts[0];

            // Check backend to see if this wallet has user data
            try {
              const data = await walletAPI.connectWallet(walletAddress);

              setWalletState((prev) => ({
                ...prev,
                isConnected: true,
                walletAddress: walletAddress,
                user: data.userExists ? data.data : null,
              }));
            } catch (error) {
              // If backend call fails, just set as connected without user data
              setWalletState((prev) => ({
                ...prev,
                isConnected: true,
                walletAddress: walletAddress,
                user: null,
              }));
            }
          }
        } catch (error) {
          console.error("Error checking wallet connection:", error);
        }
      }
    };

    checkConnection();
  }, []);

  return {
    ...walletState,
    connectWallet,
    disconnectWallet,
    isMetaMaskInstalled,
  };
};
