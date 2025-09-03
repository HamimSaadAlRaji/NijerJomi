import { useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";
import { walletAPI } from "../services/walletAPI";
import { UserRole, Web3State } from "../../types";
import LandRegistryABI from "../../LandRegistryABI.json";

// Extend Window interface to include ethereum
declare global {
  interface Window {
    ethereum?: any;
    APP_CONFIG: {
      CONTRACT_ADDRESS: string;
    };
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
  userRole?: string; // Can be either uppercase or lowercase format
  submittedAt?: string;
  // Blockchain role from contract
  blockchainRole?: UserRole;
}

export interface WalletState {
  isConnected: boolean;
  walletAddress: string | null;
  user: User | null;
  isLoading: boolean;
  error: string | null;
  // Web3 blockchain state
  web3State: Web3State;
}

export const useWallet = () => {
  const initialWeb3State: Web3State = {
    isLoading: true, // Start in loading state
    account: null,
    role: UserRole.NONE,
    provider: null,
    contract: null,
  };

  const [walletState, setWalletState] = useState<WalletState>({
    isConnected: false,
    walletAddress: null,
    user: null,
    isLoading: false,
    error: null,
    web3State: initialWeb3State,
  });

  // Determine user role from blockchain contract
  const determineRole = async (
    contract: ethers.Contract,
    account: string
  ): Promise<UserRole> => {
    try {
      if (await contract.hasRole(await contract.DEFAULT_ADMIN_ROLE(), account))
        return UserRole.ADMIN;
      if (await contract.hasRole(await contract.REGISTRAR_ROLE(), account))
        return UserRole.REGISTRAR;
      if (await contract.hasRole(await contract.COURT_ROLE(), account))
        return UserRole.COURT;
      if (await contract.hasRole(await contract.TAX_AUTHORITY_ROLE(), account))
        return UserRole.TAX_AUTHORITY;
      return UserRole.CITIZEN;
    } catch (e) {
      console.error(
        "Could not determine role. The contract might not be deployed on this network.",
        e
      );
      return UserRole.NONE;
    }
  };

  // Centralized function to set up the Web3 provider and state
  const setupWeb3 = useCallback(async (provider: ethers.BrowserProvider) => {
    try {
      // Use eth_requestAccounts for manual connection, listAccounts for eager
      const accounts = await provider.listAccounts();

      if (accounts.length > 0) {
        const signer = accounts[0]; // The first account is the signer
        const account = signer.address;

        // Only setup contract if we have APP_CONFIG
        let contract = null;
        let role = UserRole.NONE;

        if (window.APP_CONFIG?.CONTRACT_ADDRESS) {
          contract = new ethers.Contract(
            window.APP_CONFIG.CONTRACT_ADDRESS,
            LandRegistryABI.abi,
            signer
          );
          role = await determineRole(contract, account);
        }

        setWalletState((prev) => ({
          ...prev,
          web3State: {
            isLoading: false,
            account,
            provider,
            contract,
            role,
          },
        }));
      } else {
        // No accounts connected
        setWalletState((prev) => ({
          ...prev,
          web3State: { ...initialWeb3State, isLoading: false },
        }));
      }
    } catch (error) {
      console.error("Failed to set up Web3 state:", error);
      setWalletState((prev) => ({
        ...prev,
        web3State: { ...initialWeb3State, isLoading: false },
      }));
    }
  }, []);

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

      // Set up Web3 provider and get blockchain role
      const provider = new ethers.BrowserProvider(window.ethereum);
      await setupWeb3(provider);

      // Call backend API to check if user exists
      const data = await walletAPI.connectWallet(walletAddress);

      if (!data.success) {
        throw new Error(data.message);
      }

      setWalletState((prev) => ({
        ...prev,
        isConnected: true,
        walletAddress: walletAddress,
        user: data.userExists
          ? {
              ...data.data,
              blockchainRole: prev.web3State.role,
            }
          : null,
        isLoading: false,
      }));

      return {
        walletAddress,
        userExists: data.userExists,
        userData: data.userExists
          ? {
              ...data.data,
              blockchainRole: walletState.web3State.role,
            }
          : null,
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
      web3State: initialWeb3State,
    });
  };

  // Manual connect for Web3 (used by Web3 context compatibility)
  const connect = useCallback(async () => {
    await connectWallet();
  }, []);

  // Disconnect for Web3 context compatibility
  const disconnect = useCallback(() => {
    disconnectWallet();
  }, []);

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

            // Set up Web3 provider
            const provider = new ethers.BrowserProvider(window.ethereum);
            await setupWeb3(provider);

            // Check backend to see if this wallet has user data
            try {
              const data = await walletAPI.connectWallet(walletAddress);

              setWalletState((prev) => ({
                ...prev,
                isConnected: true,
                walletAddress: walletAddress,
                user: data.userExists
                  ? {
                      ...data.data,
                      blockchainRole: prev.web3State.role,
                    }
                  : null,
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
          } else {
            // No accounts, but still setup Web3 state
            if (window.ethereum) {
              const provider = new ethers.BrowserProvider(window.ethereum);
              await setupWeb3(provider);
            } else {
              setWalletState((prev) => ({
                ...prev,
                web3State: { ...initialWeb3State, isLoading: false },
              }));
            }
          }
        } catch (error) {
          console.error("Error checking wallet connection:", error);
          setWalletState((prev) => ({
            ...prev,
            web3State: { ...initialWeb3State, isLoading: false },
          }));
        }
      } else {
        setWalletState((prev) => ({
          ...prev,
          web3State: { ...initialWeb3State, isLoading: false },
        }));
      }
    };

    checkConnection();

    // Handle wallet events
    if (typeof window.ethereum !== "undefined") {
      const handleAccountsChanged = () => {
        console.log("Account change detected, reloading page.");
        window.location.reload();
      };
      const handleChainChanged = () => {
        console.log("Network change detected, reloading page.");
        window.location.reload();
      };

      window.ethereum.on("accountsChanged", handleAccountsChanged);
      window.ethereum.on("chainChanged", handleChainChanged);

      return () => {
        if (window.ethereum.removeListener) {
          window.ethereum.removeListener(
            "accountsChanged",
            handleAccountsChanged
          );
          window.ethereum.removeListener("chainChanged", handleChainChanged);
        }
      };
    }
  }, [setupWeb3]);

  return {
    ...walletState,
    connectWallet,
    disconnectWallet,
    isMetaMaskInstalled,
    // Web3 context compatibility
    connect,
    disconnect,
  };
};
