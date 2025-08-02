import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useWalletContext } from "@/contexts/WalletContext";
import { Loader2 } from "lucide-react";

interface AdminProtectedRouteProps {
  children: React.ReactNode;
}

const AdminProtectedRoute: React.FC<AdminProtectedRouteProps> = ({
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

  // If user is not admin, redirect to regular dashboard
  if (user && user.userRole !== "admin") {
    return <Navigate to="/dashboard" state={{ from: location }} replace />;
  }

  // If everything is good and user is admin, render the protected component
  return <>{children}</>;
};

export default AdminProtectedRoute;
