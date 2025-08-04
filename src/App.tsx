import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import { WalletProvider } from "@/contexts/WalletContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import AdminProtectedRoute from "@/components/AdminProtectedRoute";
import CitizenProtectedRoute from "@/components/CitizenProtectedRoute";
import PublicOnlyRoute from "@/components/PublicOnlyRoute";
import VerificationOnlyRoute from "@/components/VerificationOnlyRoute";

// Core pages loaded immediately
import Index from "./pages/Index";
import ConnectWallet from "./pages/ConnectWallet";
import NotFound from "./pages/NotFound";

// Lazy load static information pages
const WhyBlockchain = lazy(() => import("./pages/WhyBlockchain"));
const AntiCorruption = lazy(() => import("./pages/AntiCorruption"));
const UserBenefits = lazy(() => import("./pages/UserBenefits"));

// Lazy load user pages
const Properties = lazy(() => import("./pages/Properties"));
const Register = lazy(() => import("./pages/Register"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const MyProperties = lazy(() => import("./pages/MyProperties"));
const TransferManagement = lazy(() => import("./pages/TransferManagement"));
const Analytics = lazy(() => import("./pages/Analytics"));
const Government = lazy(() => import("./pages/Government"));
const Admin = lazy(() => import("./pages/Admin"));
const UserVerification = lazy(() => import("./pages/UserVerification"));
const Profile = lazy(() => import("./pages/Profile"));

// Lazy load admin pages
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const AdminVerifyUser = lazy(() => import("./pages/AdminVerifyUser"));
const AdminSetUserRole = lazy(() => import("./pages/AdminSetUserRole"));
const AdminPropertyManagement = lazy(
  () => import("./pages/AdminPropertyManagement")
);
const AdminUserManagement = lazy(() => import("./pages/AdminUserManagement"));

const queryClient = new QueryClient();

// Loading component for code-split routes
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
  </div>
);

// Wrapper component for lazy-loaded routes
const LazyRoute = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<PageLoader />}>{children}</Suspense>
);

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
            <Route
              path="/why-blockchain"
              element={
                <LazyRoute>
                  <WhyBlockchain />
                </LazyRoute>
              }
            />
            <Route
              path="/anti-corruption"
              element={
                <LazyRoute>
                  <AntiCorruption />
                </LazyRoute>
              }
            />
            <Route
              path="/user-benefits"
              element={
                <LazyRoute>
                  <UserBenefits />
                </LazyRoute>
              }
            />

            {/* User Verification - Special case: only for connected wallets without user data */}
            <Route
              path="/user-verification"
              element={
                <VerificationOnlyRoute>
                  <LazyRoute>
                    <UserVerification />
                  </LazyRoute>
                </VerificationOnlyRoute>
              }
            />

            {/* Admin Protected Routes */}
            <Route
              path="/admin/dashboard"
              element={
                <AdminProtectedRoute>
                  <LazyRoute>
                    <AdminDashboard />
                  </LazyRoute>
                </AdminProtectedRoute>
              }
            />
            <Route
              path="/admin/verify-user"
              element={
                <AdminProtectedRoute>
                  <LazyRoute>
                    <AdminVerifyUser />
                  </LazyRoute>
                </AdminProtectedRoute>
              }
            />
            <Route
              path="/admin/set-user-role"
              element={
                <AdminProtectedRoute>
                  <LazyRoute>
                    <AdminSetUserRole />
                  </LazyRoute>
                </AdminProtectedRoute>
              }
            />
            <Route
              path="/admin/user-management"
              element={
                <AdminProtectedRoute>
                  <LazyRoute>
                    <AdminUserManagement />
                  </LazyRoute>
                </AdminProtectedRoute>
              }
            />
            <Route
              path="/admin/property-management"
              element={
                <ProtectedRoute>
                  <LazyRoute>
                    <AdminPropertyManagement />
                  </LazyRoute>
                </ProtectedRoute>
              }
            />

            {/* Citizen Protected Routes - Normal users only, admins redirected to admin dashboard */}
            <Route
              path="/properties"
              element={
                <CitizenProtectedRoute>
                  <LazyRoute>
                    <Properties />
                  </LazyRoute>
                </CitizenProtectedRoute>
              }
            />
            <Route
              path="/register"
              element={
                <CitizenProtectedRoute>
                  <LazyRoute>
                    <Register />
                  </LazyRoute>
                </CitizenProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <CitizenProtectedRoute>
                  <LazyRoute>
                    <Dashboard />
                  </LazyRoute>
                </CitizenProtectedRoute>
              }
            />
            <Route
              path="/my-properties"
              element={
                <CitizenProtectedRoute>
                  <LazyRoute>
                    <MyProperties />
                  </LazyRoute>
                </CitizenProtectedRoute>
              }
            />
            <Route
              path="/transfer-management"
              element={
                <CitizenProtectedRoute>
                  <LazyRoute>
                    <TransferManagement />
                  </LazyRoute>
                </CitizenProtectedRoute>
              }
            />
            <Route
              path="/analytics"
              element={
                <CitizenProtectedRoute>
                  <LazyRoute>
                    <Analytics />
                  </LazyRoute>
                </CitizenProtectedRoute>
              }
            />
            <Route
              path="/government"
              element={
                <CitizenProtectedRoute>
                  <LazyRoute>
                    <Government />
                  </LazyRoute>
                </CitizenProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <CitizenProtectedRoute>
                  <LazyRoute>
                    <Admin />
                  </LazyRoute>
                </CitizenProtectedRoute>
              }
            />

            {/* Profile Route - Available to all authenticated users (including admins) */}
            <Route
              path="/profile/:walletAddress"
              element={
                <ProtectedRoute>
                  <LazyRoute>
                    <Profile />
                  </LazyRoute>
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
