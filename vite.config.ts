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
        manualChunks: (id) => {
          // Keep all node_modules in vendor chunk
          if (id.includes("node_modules")) {
            // Keep class-variance-authority and related utilities together
            if (
              id.includes("class-variance-authority") ||
              id.includes("clsx") ||
              id.includes("tailwind-merge")
            ) {
              return "ui-vendor";
            }
            // Core React libraries
            if (
              id.includes("react") ||
              id.includes("react-dom") ||
              id.includes("react-router")
            ) {
              return "vendor";
            }
            // Lucide icons
            if (id.includes("lucide-react")) {
              return "icons";
            }
            // Other node_modules
            return "vendor";
          }

          // Keep all UI components together with their dependencies
          if (
            id.includes("/src/components/ui/") ||
            id.includes("/src/lib/utils")
          ) {
            return "ui-components";
          }

          // Admin pages
          if (id.includes("/src/pages/Admin")) {
            return "admin-pages";
          }

          // Static pages
          if (
            id.includes("/src/pages/WhyBlockchain") ||
            id.includes("/src/pages/AntiCorruption") ||
            id.includes("/src/pages/UserBenefits")
          ) {
            return "static-pages";
          }

          // User pages
          if (
            id.includes("/src/pages/Properties") ||
            id.includes("/src/pages/Register") ||
            id.includes("/src/pages/Dashboard") ||
            id.includes("/src/pages/MyProperties") ||
            id.includes("/src/pages/Profile")
          ) {
            return "user-pages";
          }

          // Services and utilities
          if (
            id.includes("/src/services/") ||
            id.includes("/src/lib/") ||
            id.includes("/src/hooks/")
          ) {
            return "utils";
          }
        },
      },
    },
    // Increase warning limit to 1MB
    chunkSizeWarningLimit: 1000,
  },
}));
