import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface WalletErrorProps {
  error: string;
  onRetry: () => void;
  isRetrying?: boolean;
}

export const WalletErrorDisplay: React.FC<WalletErrorProps> = ({
  error,
  onRetry,
  isRetrying = false,
}) => {
  const getErrorDetails = (errorMessage: string) => {
    if (errorMessage.includes("timeout") || errorMessage.includes("Connection timeout")) {
      return {
        title: "Connection Timeout",
        description: "The wallet connection timed out. This usually happens when MetaMask is locked or when entering your password takes too long.",
        suggestion: "Please unlock MetaMask and try again. Make sure to enter your password within 60 seconds.",
        canRetry: true,
      };
    }
    
    if (errorMessage.includes("User rejected") || errorMessage.includes("User denied")) {
      return {
        title: "Connection Cancelled",
        description: "You cancelled the wallet connection request.",
        suggestion: "Click the button below to try connecting again.",
        canRetry: true,
      };
    }
    
    if (errorMessage.includes("MetaMask is not installed")) {
      return {
        title: "MetaMask Not Found",
        description: "MetaMask extension is not installed in your browser.",
        suggestion: "Please install MetaMask to continue using this application.",
        canRetry: false,
      };
    }
    
    if (errorMessage.includes("No accounts")) {
      return {
        title: "No Accounts Available",
        description: "No accounts were found in your MetaMask wallet.",
        suggestion: "Please make sure you have at least one account in MetaMask and try again.",
        canRetry: true,
      };
    }
    
    if (errorMessage.includes("Failed to verify wallet connection")) {
      return {
        title: "Server Connection Error",
        description: "Unable to verify your wallet with our servers.",
        suggestion: "Please check your internet connection and try again.",
        canRetry: true,
      };
    }
    
    // Default error
    return {
      title: "Connection Error",
      description: errorMessage,
      suggestion: "Please try connecting again. If the problem persists, refresh the page.",
      canRetry: true,
    };
  };

  const errorDetails = getErrorDetails(error);

  return (
    <Alert variant="destructive" className="max-w-md mx-auto">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>{errorDetails.title}</AlertTitle>
      <AlertDescription className="mt-2 space-y-2">
        <p>{errorDetails.description}</p>
        <p className="text-sm text-muted-foreground">{errorDetails.suggestion}</p>
        {errorDetails.canRetry && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRetry}
            disabled={isRetrying}
            className="mt-3"
          >
            {isRetrying ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Retrying...
              </>
            ) : (
              "Try Again"
            )}
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
};
