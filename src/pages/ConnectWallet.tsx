import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import WalletConnectButton from "@/components/WalletConnectButton";
import { useWalletContext } from "@/contexts/WalletContext";
import { useEffect } from "react";
import { Wallet, Shield, Lock } from "lucide-react";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { isConnected, user } = useWalletContext();

  // Redirect if already connected and has user data
  useEffect(() => {
    if (isConnected && user) {
      navigate("/dashboard");
    }
  }, [isConnected, user, navigate]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="p-3 bg-primary/10 rounded-full">
              <Wallet className="w-8 h-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">
            Welcome to terraTrust
          </CardTitle>
          <CardDescription className="text-base">
            Connect your wallet to access secure property management on the
            blockchain
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <Shield className="w-5 h-5 text-green-600" />
              <div>
                <p className="font-medium text-sm">Secure & Decentralized</p>
                <p className="text-xs text-gray-600">
                  Your data is protected by blockchain technology
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <Lock className="w-5 h-5 text-blue-600" />
              <div>
                <p className="font-medium text-sm">Non-Custodial</p>
                <p className="text-xs text-gray-600">
                  You maintain full control of your wallet
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <WalletConnectButton size="lg" className="w-full" />

            <Button
              variant="outline"
              size="lg"
              className="w-full"
              onClick={() => navigate("/")}
            >
              Back to Home
            </Button>
          </div>

          <div className="text-center">
            <p className="text-xs text-gray-500">
              Don't have MetaMask?{" "}
              <a
                href="https://metamask.io/download/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Install it here
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
