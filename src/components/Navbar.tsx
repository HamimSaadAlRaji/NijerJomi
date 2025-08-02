import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Shield, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import WalletConnectButton from "./WalletConnectButton";
import { useWalletContext } from "@/contexts/WalletContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { isConnected, user } = useWalletContext();

  // User is considered logged in if wallet is connected and user data exists
  const isLoggedIn = isConnected && user;

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 w-full z-50 bg-transparent mt-3">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
          >
            <div>
              <h1 className="text-4xl font-roboto text-white">terraTrust</h1>
            </div>
          </Link>

          {/* Desktop Navigation - Show different content based on login status */}
          <div className="hidden md:flex items-center space-x-8">
            {/* Always show Home */}
            <Link
              to="/"
              className={`text-xl font-medium transition-colors hover:text-primary ${
                isActive("/") ? "text-primary" : "text-foreground"
              }`}
            >
              Home
            </Link>

            {/* Only show these links if user is logged in */}
            {isLoggedIn && (
              <>
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center space-x-1 text-xl font-medium text-foreground hover:text-primary transition-colors">
                    <span>Properties</span>
                    <ChevronDown className="w-4 h-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem asChild>
                      <Link to="/properties">Browse Properties</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/maps">Property Maps</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/analytics">Market Analytics</Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Link
                  to="/register"
                  className={`text-xl font-medium transition-colors hover:text-primary ${
                    isActive("/register") ? "text-primary" : "text-foreground"
                  }`}
                >
                  Register Property
                </Link>

                <Link
                  to="/verify"
                  className={`text-xl font-medium transition-colors hover:text-primary ${
                    isActive("/verify") ? "text-primary" : "text-foreground"
                  }`}
                >
                  Verify
                </Link>

                <Link
                  to="/support"
                  className={`text-xl font-medium transition-colors hover:text-primary ${
                    isActive("/support") ? "text-primary" : "text-foreground"
                  }`}
                >
                  Support
                </Link>
              </>
            )}
          </div>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isLoggedIn ? (
              <>
                <Link to="/dashboard">
                  {/* Button Styling: 
                      - size="lg" makes it bigger (change to "xl" if available, or add custom padding)
                      - rounded-full makes it completely round (change to rounded-xl for less round)
                      - text-xl makes button text larger (change to text-2xl for even larger)
                      - px-8 py-3 adds custom padding for bigger size */}
                  <Button
                    variant="outline"
                    size="lg"
                    className="rounded-full text-xl px-8 py-3"
                  >
                    Dashboard
                  </Button>
                </Link>

                <Button
                  size="lg"
                  className="bg-gradient-hero hover:opacity-90 rounded-full text-xl px-8 py-3"
                >
                  <WalletConnectButton
                    size="lg"
                    className="bg-transparent border-none p-0 hover:bg-transparent"
                  />
                </Button>
              </>
            ) : (
              <>
                <Link to="/connect-wallet">
                  {/* Connect Wallet Button - More round and bigger with xl text */}
                  <Button
                    size="lg"
                    className="rounded-full text-xl px-8 py-3 bg-transparent"
                  >
                    Connect Wallet
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-foreground hover:text-primary transition-colors"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-border animate-slide-up">
            <div className="flex flex-col space-y-4">
              {isLoggedIn ? (
                <>
                  {/* Mobile Navigation Links - Changed from text-sm to text-xl */}
                  <Link
                    to="/"
                    className="text-xl font-medium text-foreground hover:text-primary transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Home
                  </Link>
                  <Link
                    to="/properties"
                    className="text-xl font-medium text-foreground hover:text-primary transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Browse Properties
                  </Link>
                  <Link
                    to="/register"
                    className="text-xl font-medium text-foreground hover:text-primary transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Register Property
                  </Link>
                  <Link
                    to="/verify"
                    className="text-xl font-medium text-foreground hover:text-primary transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Verify
                  </Link>
                  <Link
                    to="/support"
                    className="text-xl font-medium text-foreground hover:text-primary transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Support
                  </Link>
                  <Link
                    to="/dashboard"
                    className="text-xl font-medium text-foreground hover:text-primary transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <div className="pt-4 border-t border-border">
                    {/* Mobile Button - Bigger and rounder */}
                    <WalletConnectButton
                      size="lg"
                      className="w-full bg-gradient-hero hover:opacity-90 rounded-full text-xl py-3"
                    />
                  </div>
                </>
              ) : (
                <>
                  {/* Mobile Connect Wallet Button when not logged in */}
                  <div className="text-center">
                    <WalletConnectButton
                      size="lg"
                      className="w-full bg-gradient-hero hover:opacity-90 rounded-full text-xl py-3"
                    />
                  </div>
                  <Link
                    to="/connect-wallet"
                    className="text-xl font-medium text-foreground hover:text-primary transition-colors text-center"
                    onClick={() => setIsOpen(false)}
                  >
                    Connect Wallet
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
