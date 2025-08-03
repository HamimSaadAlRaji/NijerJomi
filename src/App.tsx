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
import AdminVerifyUser from "./pages/AdminVerifyUser";
import AdminSetUserRole from "./pages/AdminSetUserRole";
import AdminPropertyManagement from "./pages/AdminPropertyManagement";
import MyProperties from "./pages/MyProperties";
import TransferManagement from "./pages/TransferManagement";
import Analytics from "./pages/Analytics";
import Government from "./pages/Government";
import Admin from "./pages/Admin";
import UserVerification from "./pages/UserVerification";
import ConnectWallet from "./pages/ConnectWallet";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import WhyBlockchain from "./pages/WhyBlockchain";
import AntiCorruption from "./pages/AntiCorruption";
import UserBenefits from "./pages/UserBenefits";

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

            {/* Public Information Pages - Accessible to everyone */}
            <Route path="/why-blockchain" element={<WhyBlockchain />} />
            <Route path="/anti-corruption" element={<AntiCorruption />} />
            <Route path="/user-benefits" element={<UserBenefits />} />

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
            <Route
              path="/admin/verify-user"
              element={
                <AdminProtectedRoute>
                  <AdminVerifyUser />
                </AdminProtectedRoute>
              }
            />
            <Route
              path="/admin/set-user-role"
              element={
                <AdminProtectedRoute>
                  <AdminSetUserRole />
                </AdminProtectedRoute>
              }
            />
            <Route
              path="/admin/property-management"
              element={
                <ProtectedRoute>
                  <AdminPropertyManagement />
                </ProtectedRoute>
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
              path="/my-properties"
              element={
                <CitizenProtectedRoute>
                  <MyProperties />
                </CitizenProtectedRoute>
              }
            />
            <Route
              path="/transfer-management"
              element={
                <CitizenProtectedRoute>
                  <TransferManagement />
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
