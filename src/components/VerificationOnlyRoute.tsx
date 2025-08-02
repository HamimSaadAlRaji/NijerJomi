import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useWalletContext } from "@/contexts/WalletContext";
import { Loader2 } from "lucide-react";

interface VerificationOnlyRouteProps {
  children: React.ReactNode;
}

const VerificationOnlyRoute: React.FC<VerificationOnlyRouteProps> = ({
  children,
}) => {
  const { isConnected, user, isLoading } = useWalletContext();
  const location = useLocation();

  // Show loading spinner while checking wallet connection
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  // If not connected, redirect to home page
  if (!isConnected) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // If connected and user data exists, redirect to dashboard
  if (isConnected && user) {
    return <Navigate to="/dashboard" state={{ from: location }} replace />;
  }

  // If connected but no user data, allow access to verification
  return <>{children}</>;
};

export default VerificationOnlyRoute;
