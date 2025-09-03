// API base URL
import { API_BASE_URL } from "../config/constants";

export interface ConnectWalletResponse {
  success: boolean;
  message: string;
  userExists: boolean;
  walletAddress?: string;
  data?: {
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
  };
  error?: string;
}

export const walletAPI = {
  // Connect wallet and check if user exists with retry logic
  connectWallet: async (
    walletAddress: string,
    retryCount = 3
  ): Promise<ConnectWalletResponse> => {
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= retryCount; attempt++) {
      try {
        // Add a small delay for subsequent attempts to handle timing issues
        if (attempt > 1) {
          await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
        }

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

        const response = await fetch(`${API_BASE_URL}/connect-wallet`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ walletAddress }),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          // Handle specific HTTP status codes
          if (response.status === 404) {
            throw new Error("API endpoint not found. Please check your connection and try again.");
          } else if (response.status >= 500) {
            throw new Error("Server error. Please try again in a moment.");
          } else if (response.status === 429) {
            throw new Error("Too many requests. Please wait a moment and try again.");
          }
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        return data;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        
        // Don't retry on abort errors or client errors (except 404)
        if (lastError.name === 'AbortError') {
          throw new Error("Request timed out. Please check your connection and try again.");
        }
        
        // Log the attempt for debugging
        console.warn(`Wallet connection attempt ${attempt} failed:`, lastError.message);
        
        // If this is the last attempt, throw the error
        if (attempt === retryCount) {
          break;
        }
      }
    }

    throw new Error(`Failed to connect wallet after ${retryCount} attempts: ${lastError?.message || 'Unknown error'}`);
  },

  // Get user data by wallet address
  getUserByWalletAddress: async (walletAddress: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/user/${walletAddress}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch user data");
      }

      return data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to fetch user: ${errorMessage}`);
    }
  },

  // Register new user with wallet
  registerUser: async (userData: {
    walletAddress: string;
    fullName: string;
    nidNumber: string;
    phoneNumber: string;
    presentAddress: string;
    permanentAddress: string;
    profilePicture?: string;
    userRole?: string; // Will be uppercase format (ADMIN, REGISTRAR, etc.)
  }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/register-user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to register user: ${errorMessage}`);
    }
  },

  // Register user for verification (used by user verification page)
  register: async (userData: {
    walletAddress: string;
    fullName: string;
    nidNumber: string;
    phoneNumber: string;
    presentAddress: string;
    permanentAddress: string;
    profilePicture?: string;
    userRole?: string; // Will be uppercase format (ADMIN, REGISTRAR, etc.)
  }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to register user: ${errorMessage}`);
    }
  },
};

export default walletAPI;
