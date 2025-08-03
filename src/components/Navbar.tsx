import { useState } from "react";
import { useLocation } from "react-router-dom";
import { useWalletContext } from "@/contexts/WalletContext";
import NavbarLogo from "./Navbar/NavbarLogo";
import DesktopNavigation from "./Navbar/DesktopNavigation";
import NavbarActions from "./Navbar/NavbarActions";
import MobileMenuButton from "./Navbar/MobileMenuButton";
import MobileNavbar from "./Navbar/MobileNavbar";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { isConnected, user } = useWalletContext();

  // User is considered logged in if wallet is connected and user data exists
  const isLoggedIn = Boolean(isConnected && user);

  // Check if we're on the landing page
  const isLandingPage = location.pathname === "/";

  // Dynamic navbar styles based on page
  const navbarClasses = isLandingPage
    ? "fixed top-0 w-full z-50 bg-transparent border-b border-transparent"
    : "fixed top-0 w-full z-50 bg-black/60 backdrop-blur-md border-b border-gray-700/50";

  return (
    <nav className={navbarClasses}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <NavbarLogo />

          {/* Desktop Navigation */}
          <DesktopNavigation isLoggedIn={isLoggedIn} user={user} />

          {/* Action Buttons */}
          <NavbarActions isLoggedIn={isLoggedIn} user={user} />

          {/* Mobile menu button */}
          <MobileMenuButton isOpen={isOpen} setIsOpen={setIsOpen} />
        </div>

        {/* Mobile Navigation */}
        <MobileNavbar
          isOpen={isOpen}
          isLoggedIn={isLoggedIn}
          user={user}
          setIsOpen={setIsOpen}
        />
      </div>
    </nav>
  );
};

export default Navbar;
