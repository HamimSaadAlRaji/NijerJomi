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
  const { isConnected, user, isLoading } = useWalletContext();

  // Redirect if already connected and has user data
  useEffect(() => {
    if (isConnected && user) {
      navigate("/dashboard");
    }
  }, [isConnected, user, navigate]);

  // Show loading state while connecting
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <Card
          className="w-full max-w-md border"
          style={{ borderColor: "#a1d99b" }}
        >
          <CardContent className="flex flex-col items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 mb-4" style={{ borderColor: "#41ab5d" }}></div>
            <p className="text-center" style={{ color: "#465465" }}>
              Connecting to wallet...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <Card
        className="w-full max-w-md border"
        style={{ borderColor: "#a1d99b" }}
      >
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div
              className="p-3 rounded-full"
              style={{ backgroundColor: "#f7fcf5" }}
            >
              <Wallet className="w-8 h-8" style={{ color: "#41ab5d" }} />
            </div>
          </div>
          <CardTitle
            className="text-2xl font-bold"
            style={{ color: "#465465" }}
          >
            Welcome to NijerJomi
          </CardTitle>
          <CardDescription className="text-base" style={{ color: "#293842" }}>
            Connect your wallet to access secure property management on the
            blockchain
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div
              className="flex items-center space-x-3 p-3 rounded-lg"
              style={{ backgroundColor: "#f7fcf5" }}
            >
              <Shield className="w-5 h-5" style={{ color: "#41ab5d" }} />
              <div>
                <p className="font-medium text-sm" style={{ color: "#465465" }}>
                  Secure & Decentralized
                </p>
                <p className="text-xs" style={{ color: "#465465" }}>
                  Your data is protected by blockchain technology
                </p>
              </div>
            </div>

            <div
              className="flex items-center space-x-3 p-3 rounded-lg"
              style={{ backgroundColor: "#f7fcf5" }}
            >
              <Lock className="w-5 h-5" style={{ color: "#293842" }} />
              <div>
                <p className="font-medium text-sm" style={{ color: "#465465" }}>
                  Non-Custodial
                </p>
                <p className="text-xs" style={{ color: "#465465" }}>
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
            <p className="text-xs" style={{ color: "#465465" }}>
              Don't have MetaMask?{" "}
              <a
                href="https://metamask.io/download/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
                style={{ color: "#41ab5d" }}
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
