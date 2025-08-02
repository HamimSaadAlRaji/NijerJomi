import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useWalletContext } from "@/contexts/WalletContext";
import { walletAPI } from "@/services/walletAPI";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import ProfileCard from "@/components/Profile/ProfileCard";
import PersonalInfoCard from "@/components/Profile/PersonalInfoCard";
import AddressInfoCard from "@/components/Profile/AddressInfoCard";
import BlockchainInfoCard from "@/components/Profile/BlockchainInfoCard";

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
  createdAt: string;
  updatedAt: string;
  profilePicture?: string;
}

const Profile: React.FC = () => {
  const { walletAddress } = useParams<{ walletAddress: string }>();
  const navigate = useNavigate();
  const { walletAddress: connectedWallet } = useWalletContext();
  const { toast } = useToast();

  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if this is the user's own profile
  const isOwnProfile =
    connectedWallet?.toLowerCase() === walletAddress?.toLowerCase();

  useEffect(() => {
    const fetchUserData = async () => {
      if (!walletAddress) {
        setError("No wallet address provided");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await walletAPI.getUserByWalletAddress(walletAddress);

        if (response.success && response.user) {
          setUserData(response.user);
          setError(null);
        } else {
          setError(response.message || "User not found");
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("Failed to load user profile");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [walletAddress]);

  const handleCopyAddress = (address: string) => {
    navigator.clipboard.writeText(address);
    toast({
      title: "📋 Copied!",
      description: "Wallet address copied to clipboard",
    });
  };

  const handleEditProfile = () => {
    // TODO: Implement edit profile functionality
    toast({
      title: "🚧 Coming Soon",
      description: "Edit profile functionality will be available soon!",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error || !userData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto mt-20 bg-white rounded-lg shadow-xl p-8 text-center">
            <div className="text-6xl mb-4">😔</div>
            <h2 className="text-xl font-bold mb-2">User Not Found</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={() => navigate(-1)}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navbar />

      <div className="container mx-auto px-4 py-8 mt-20">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="hover:bg-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          {isOwnProfile && (
            <Button
              className="bg-blue-600 hover:bg-blue-700"
              onClick={handleEditProfile}
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              Edit Profile
            </Button>
          )}
        </div>

        {/* Profile Components Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card - Takes 1 column */}
          <div className="lg:col-span-1">
            <ProfileCard
              userData={userData}
              onCopyAddress={handleCopyAddress}
            />
          </div>

          {/* Information Cards - Takes 2 columns */}
          <div className="lg:col-span-2 space-y-8">
            <PersonalInfoCard userData={userData} />
            <AddressInfoCard userData={userData} />
          </div>
        </div>

        {/* Blockchain Info - Full width */}
        <div className="mt-8">
          <BlockchainInfoCard userData={userData} />
        </div>
      </div>
    </div>
  );
};

export default Profile;
