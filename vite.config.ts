import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(
    Boolean
  ),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Core vendor libraries
          vendor: ["react", "react-dom", "react-router-dom"],
          // UI components
          ui: [
            "@/components/ui/button",
            "@/components/ui/input",
            "@/components/ui/card",
            "@/components/ui/dialog",
            "@/components/ui/form",
          ],
          // Lucide icons
          icons: ["lucide-react"],
          // Static information pages
          "static-pages": [
            "./src/pages/WhyBlockchain",
            "./src/pages/AntiCorruption",
            "./src/pages/UserBenefits",
          ],
          // Admin pages
          "admin-pages": [
            "./src/pages/AdminDashboard",
            "./src/pages/AdminVerifyUser",
            "./src/pages/AdminSetUserRole",
            "./src/pages/AdminPropertyManagement",
          ],
          // User pages
          "user-pages": [
            "./src/pages/Properties",
            "./src/pages/Register",
            "./src/pages/Dashboard",
            "./src/pages/MyProperties",
            "./src/pages/Profile",
          ],
          // Utilities
          utils: [
            "./src/services/blockchainService",
            "./src/services/walletAPI",
            "./src/lib/utils",
          ],
        },
      },
    },
    // Increase warning limit to 1MB
    chunkSizeWarningLimit: 1000,
  },
}));
