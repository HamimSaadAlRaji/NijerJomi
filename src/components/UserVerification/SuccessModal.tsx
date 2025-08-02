import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Shield, ArrowRight } from "lucide-react";

interface SuccessModalProps {
  isOpen: boolean;
  onDashboardClick: () => void;
  walletAddress?: string;
}

const SuccessModal: React.FC<SuccessModalProps> = ({
  isOpen,
  onDashboardClick,
  walletAddress,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="bg-white w-full max-w-md mx-4 shadow-2xl">
        <CardContent className="p-8 text-center">
          <div className="mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Registration Complete!
            </h2>
            <p className="text-gray-600 mb-6">
              Your registration is currently being verified by the
              Administration.
            </p>
            {walletAddress && (
              <div className="bg-gray-50 rounded-lg p-3 mb-4">
                <p className="text-sm text-gray-500 mb-1">Registered Wallet:</p>
                <p className="font-mono text-sm text-gray-800">
                  {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                </p>
              </div>
            )}
            <div className="flex items-center justify-center text-sm text-gray-500 mb-6">
              <Shield className="w-4 h-4 mr-2" />
              <span>Secure verification in progress</span>
            </div>
          </div>
          <Button
            onClick={onDashboardClick}
            className="w-full bg-black hover:bg-gray-800 text-white py-3"
          >
            Go to Dashboard
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SuccessModal;
