// API base URL
const API_BASE_URL = "http://localhost:3000/api";

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
    submittedAt?: string;
  };
  error?: string;
}

export const walletAPI = {
  // Connect wallet and check if user exists
  connectWallet: async (
    walletAddress: string
  ): Promise<ConnectWalletResponse> => {
    try {
      const response = await fetch(`${API_BASE_URL}/connect-wallet`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ walletAddress }),
      });

      const data = await response.json();
      return data;
    } catch (error: any) {
      throw new Error(`Failed to connect wallet: ${error.message}`);
    }
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
    } catch (error: any) {
      throw new Error(`Failed to fetch user: ${error.message}`);
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
    } catch (error: any) {
      throw new Error(`Failed to register user: ${error.message}`);
    }
  },
};

export default walletAPI;
