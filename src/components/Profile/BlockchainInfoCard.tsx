import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, Clock } from "lucide-react";

interface UserData {
  walletAddress: string;
  createdAt: string;
  updatedAt: string;
}

interface BlockchainInfoCardProps {
  userData: UserData;
}

const BlockchainInfoCard: React.FC<BlockchainInfoCardProps> = ({
  userData,
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <Card className="shadow-xl border-0">
      <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-t-lg">
        <CardTitle className="flex items-center">
          <Link className="w-5 h-5 mr-2" />
          Blockchain Information ⛓️
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          <div>
            <label className="text-sm font-medium text-gray-500 mb-2 block">
              🔗 Wallet Address
            </label>
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-200">
              <div className="flex items-center justify-between">
                <code className="text-sm font-mono text-purple-800 break-all">
                  {userData.walletAddress}
                </code>
                <button
                  onClick={() =>
                    navigator.clipboard.writeText(userData.walletAddress)
                  }
                  className="ml-2 p-2 hover:bg-purple-100 rounded-md transition-colors"
                  title="Copy to clipboard"
                >
                  📋
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Short: {truncateAddress(userData.walletAddress)}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500 mb-2 block">
                ⏰ Account Created
              </label>
              <div className="flex items-center bg-gray-50 p-3 rounded-lg">
                <Clock className="w-4 h-4 mr-2 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    {formatDate(userData.createdAt)}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500 mb-2 block">
                🔄 Last Updated
              </label>
              <div className="flex items-center bg-gray-50 p-3 rounded-lg">
                <Clock className="w-4 h-4 mr-2 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    {formatDate(userData.updatedAt)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BlockchainInfoCard;
