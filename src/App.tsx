import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { WalletProvider } from "@/contexts/WalletContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import AdminProtectedRoute from "@/components/AdminProtectedRoute";
import CitizenProtectedRoute from "@/components/CitizenProtectedRoute";
import PublicOnlyRoute from "@/components/PublicOnlyRoute";
import VerificationOnlyRoute from "@/components/VerificationOnlyRoute";
import Index from "./pages/Index";
import Properties from "./pages/Properties";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Verify from "./pages/Verify";
import Maps from "./pages/Maps";
import Analytics from "./pages/Analytics";
import Support from "./pages/Support";
import Government from "./pages/Government";
import Admin from "./pages/Admin";
import UserVerification from "./pages/UserVerification";
import ConnectWallet from "./pages/ConnectWallet";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <WalletProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Only Routes - Logged in users will be redirected */}
            <Route
              path="/"
              element={
                <PublicOnlyRoute>
                  <Index />
                </PublicOnlyRoute>
              }
            />
            <Route
              path="/connect-wallet"
              element={
                <PublicOnlyRoute>
                  <ConnectWallet />
                </PublicOnlyRoute>
              }
            />

            {/* User Verification - Special case: only for connected wallets without user data */}
            <Route
              path="/user-verification"
              element={
                <VerificationOnlyRoute>
                  <UserVerification />
                </VerificationOnlyRoute>
              }
            />

            {/* Admin Protected Routes */}
            <Route
              path="/admin/dashboard"
              element={
                <AdminProtectedRoute>
                  <AdminDashboard />
                </AdminProtectedRoute>
              }
            />

            {/* Citizen Protected Routes - Normal users only, admins redirected to admin dashboard */}
            <Route
              path="/properties"
              element={
                <CitizenProtectedRoute>
                  <Properties />
                </CitizenProtectedRoute>
              }
            />
            <Route
              path="/register"
              element={
                <CitizenProtectedRoute>
                  <Register />
                </CitizenProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <CitizenProtectedRoute>
                  <Dashboard />
                </CitizenProtectedRoute>
              }
            />
            <Route
              path="/verify"
              element={
                <CitizenProtectedRoute>
                  <Verify />
                </CitizenProtectedRoute>
              }
            />
            <Route
              path="/maps"
              element={
                <CitizenProtectedRoute>
                  <Maps />
                </CitizenProtectedRoute>
              }
            />
            <Route
              path="/analytics"
              element={
                <CitizenProtectedRoute>
                  <Analytics />
                </CitizenProtectedRoute>
              }
            />
            <Route
              path="/support"
              element={
                <CitizenProtectedRoute>
                  <Support />
                </CitizenProtectedRoute>
              }
            />
            <Route
              path="/government"
              element={
                <CitizenProtectedRoute>
                  <Government />
                </CitizenProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <CitizenProtectedRoute>
                  <Admin />
                </CitizenProtectedRoute>
              }
            />

            {/* Profile Route - Available to all authenticated users (including admins) */}
            <Route
              path="/profile/:walletAddress"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />

            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </WalletProvider>
  </QueryClientProvider>
);

export default App;
