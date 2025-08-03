import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useWalletContext } from "@/contexts/WalletContext";
import NavbarLogo from "./Navbar/NavbarLogo";
import DesktopNavigation from "./Navbar/DesktopNavigation";
import NavbarActions from "./Navbar/NavbarActions";
import MobileMenuButton from "./Navbar/MobileMenuButton";
import MobileNavbar from "./Navbar/MobileNavbar";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [showNavbar, setShowNavbar] = useState(true);
  const location = useLocation();
  const { isConnected, user } = useWalletContext();

  // User is considered logged in if wallet is connected and user data exists
  const isLoggedIn = Boolean(isConnected && user);

  // Check if we're on the landing page
  const isLandingPage = location.pathname === "/";

  useEffect(() => {
    if (!isLandingPage) return; // Only apply scroll behavior on landing page

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < 10) {
        // At the top - always show navbar with transparent style
        setShowNavbar(true);
      } else if (currentScrollY > lastScrollY) {
        // Scrolling down - hide navbar
        setShowNavbar(false);
      } else {
        // Scrolling up - show navbar with white background
        setShowNavbar(true);
      }

      setLastScrollY(currentScrollY);
      setScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY, isLandingPage]);

  // Determine navbar styles based on scroll position and page
  const getNavbarStyles = () => {
    if (!isLandingPage) {
      // Non-landing pages: always black navbar
      return "fixed top-0 w-full z-50 bg-black/60 backdrop-blur-md border-b border-gray-700/50 transition-all duration-300";
    }

    if (scrollY < 10) {
      // Landing page at top: transparent navbar
      return `fixed top-0 w-full z-50 bg-transparent border-b border-transparent transition-all duration-300 ${
        showNavbar ? "translate-y-0" : "-translate-y-full"
      }`;
    }

    // Landing page scrolled: white navbar when scrolling up, hidden when scrolling down
    return `fixed top-0 w-full z-50 bg-white/70 backdrop-blur-lg border-b border-gray-200/30 shadow-lg transition-all duration-300 ${
      showNavbar ? "translate-y-0" : "-translate-y-full"
    }`;
  };

  // Determine if we should use dark theme (white background navbar)
  const isDarkTheme = isLandingPage && scrollY >= 10 && showNavbar;

  return (
    <nav className={getNavbarStyles()}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <NavbarLogo isDarkTheme={isDarkTheme} />

          {/* Desktop Navigation */}
          <DesktopNavigation
            isLoggedIn={isLoggedIn}
            user={user}
            isDarkTheme={isDarkTheme}
          />

          {/* Action Buttons */}
          <NavbarActions
            isLoggedIn={isLoggedIn}
            user={user}
            isDarkTheme={isDarkTheme}
          />

          {/* Mobile menu button */}
          <MobileMenuButton
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            isDarkTheme={isDarkTheme}
          />
        </div>

        {/* Mobile Navigation */}
        <MobileNavbar
          isOpen={isOpen}
          isLoggedIn={isLoggedIn}
          user={user}
          setIsOpen={setIsOpen}
          isDarkTheme={isDarkTheme}
        />
      </div>
    </nav>
  );
};

export default Navbar;
