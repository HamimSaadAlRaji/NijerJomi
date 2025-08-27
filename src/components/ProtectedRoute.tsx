import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useWalletContext } from "@/contexts/WalletContext";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
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

  // If wallet is not connected, redirect to home
  if (!isConnected) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // If wallet is connected but user data doesn't exist, redirect to verification
  if (isConnected && !user) {
    return (
      <Navigate to="/user-verification" state={{ from: location }} replace />
    );
  }

  // If user exists but is not verified, redirect to not-verified page
  if (user && user.status !== "accepted") {
    return <Navigate to="/not-verified" state={{ from: location }} replace />;
  }

  // If everything is good, render the protected component
  return <>{children}</>;
};

export default ProtectedRoute;
