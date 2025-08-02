import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useWalletContext } from "@/contexts/WalletContext";
import { Loader2 } from "lucide-react";

interface PublicOnlyRouteProps {
  children: React.ReactNode;
}

const PublicOnlyRoute: React.FC<PublicOnlyRouteProps> = ({ children }) => {
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

  // If wallet is connected and user data exists, redirect to dashboard
  if (isConnected && user) {
    return <Navigate to="/dashboard" state={{ from: location }} replace />;
  }

  // If wallet is connected but no user data, redirect to user verification
  if (isConnected && !user) {
    return (
      <Navigate to="/user-verification" state={{ from: location }} replace />
    );
  }

  // If not connected, allow access to public pages
  return <>{children}</>;
};

export default PublicOnlyRoute;
