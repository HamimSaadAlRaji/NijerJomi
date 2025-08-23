import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ExternalLink, Download, Wallet } from "lucide-react";

const MetaMaskGuide: React.FC = () => {
  const handleInstallMetaMask = () => {
    window.open("https://metamask.io/download/", "_blank");
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Wallet className="w-16 h-16 text-primary" />
          </div>
          <CardTitle className="text-2xl">MetaMask Required</CardTitle>
          <CardDescription>
            <p className="text-gray-600 mb-6">
            To connect your wallet and access nijerJomi, you need to install
            MetaMask first. Follow these simple steps:
          </p>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-semibold">What is MetaMask?</h4>
            <p className="text-sm text-muted-foreground">
              MetaMask is a secure wallet for Ethereum and other blockchain
              networks. It allows you to safely store and manage your
              cryptocurrency.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold">Installation Steps:</h4>
            <ol className="text-sm text-muted-foreground space-y-1">
              <li>1. Click "Install MetaMask" below</li>
              <li>2. Add the extension to your browser</li>
              <li>3. Create or import your wallet</li>
              <li>4. Return to nijerJomi and refresh the page</li>
            </ol>
          </div>

          <div className="space-y-3 pt-4">
            <Button
              onClick={handleInstallMetaMask}
              className="w-full bg-orange-500 hover:bg-orange-600"
              size="lg"
            >
              <Download className="w-4 h-4 mr-2" />
              Install MetaMask
              <ExternalLink className="w-4 h-4 ml-2" />
            </Button>

            <Button
              onClick={handleRefresh}
              variant="outline"
              className="w-full"
              size="lg"
            >
              I've Installed MetaMask - Refresh Page
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MetaMaskGuide;
