import React, { createContext, useContext, ReactNode } from "react";
import { useWallet, WalletState, User } from "../hooks/useWallet";
import { UserRole } from "../../types";

interface WalletContextType extends WalletState {
  connectWallet: () => Promise<{
    walletAddress: string;
    userExists: boolean;
    userData: User | null;
  } | null>;
  disconnectWallet: () => void;
  isMetaMaskInstalled: () => boolean;
  // Web3 blockchain functionality
  web3State: {
    isLoading: boolean;
    account: string | null;
    role: UserRole;
    provider: any | null;
    contract: any | null;
  };
  connect: () => Promise<void>;
  disconnect: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const wallet = useWallet();

  return (
    <WalletContext.Provider value={wallet}>{children}</WalletContext.Provider>
  );
};

export const useWalletContext = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error("useWalletContext must be used within a WalletProvider");
  }
  return context;
};
