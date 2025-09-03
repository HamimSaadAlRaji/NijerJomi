import { ethers } from "ethers";

/**
 * Utility function to safely request MetaMask accounts with retry logic
 * This helps handle cases where the user takes time to enter their password
 */
export const safeRequestAccounts = async (maxRetries = 2): Promise<string[]> => {
  let attempts = 0;
  
  while (attempts < maxRetries) {
    try {
      // Create a promise that resolves when accounts are received
      const accountsPromise = window.ethereum?.request({
        method: "eth_requestAccounts",
      });

      if (!accountsPromise) {
        throw new Error("MetaMask is not available");
      }

      // Create a timeout promise
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => {
          reject(new Error("Connection timeout - please try again"));
        }, 180000); // 180 second timeout
      });

      // Race between getting accounts and timeout
      const accounts = await Promise.race([accountsPromise, timeoutPromise]) as string[];
      
      if (Array.isArray(accounts) && accounts.length > 0) {
        return accounts;
      }
      
      throw new Error("No accounts returned from MetaMask");
    } catch (error) {
      attempts++;
      
      if (error instanceof Error) {
        // Don't retry for user rejection
        if (error.message.includes("User rejected") || 
            error.message.includes("User denied") ||
            error.message.includes("user rejected the request")) {
          throw error;
        }
        
        // If this is the last attempt, throw the error
        if (attempts >= maxRetries) {
          throw error;
        }
        
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log(`Retrying wallet connection (attempt ${attempts + 1}/${maxRetries})`);
      } else {
        throw new Error("Unknown error occurred during wallet connection");
      }
    }
  }
  
  throw new Error("Failed to connect to wallet after multiple attempts");
};

/**
 * Utility function to safely create provider and wait for it to be ready
 */
export const safeCreateProvider = async (): Promise<ethers.BrowserProvider> => {
  if (!window.ethereum) {
    throw new Error("MetaMask is not installed");
  }
  
  const provider = new ethers.BrowserProvider(window.ethereum);
  
  // Wait a bit to ensure the provider is ready
  await new Promise(resolve => setTimeout(resolve, 100));
  
  return provider;
};

/**
 * Utility function to check if MetaMask is unlocked
 */
export const isMetaMaskUnlocked = async (): Promise<boolean> => {
  if (!window.ethereum) {
    return false;
  }
  
  try {
    const accounts = await window.ethereum.request({
      method: "eth_accounts",
    }) as string[];
    return Array.isArray(accounts) && accounts.length > 0;
  } catch {
    return false;
  }
};

/**
 * Utility function to wait for MetaMask to be unlocked
 */
export const waitForMetaMaskUnlock = async (timeoutMs = 30000): Promise<boolean> => {
  const startTime = Date.now();
  
  while (Date.now() - startTime < timeoutMs) {
    if (await isMetaMaskUnlocked()) {
      return true;
    }
    
    // Wait 500ms before checking again
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  return false;
};
