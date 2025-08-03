import { Link } from "react-router-dom";
import {
  Shield,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Linkedin,
  Github,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Footer = () => {
  return (
    <footer className="bg-background text-foreground border-t border-border">
      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8">
          {/* Brand */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h3 className="text-xl font-bold">terraTrust</h3>
                <p className="text-muted-foreground text-sm">
                  Bangladesh Registry
                </p>
              </div>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Revolutionizing Bangladesh's land registry system through
              blockchain technology, ensuring transparent, secure, and
              corruption-free property ownership.
            </p>
            <div className="flex space-x-4">
              <Button
                size="sm"
                variant="ghost"
                className="text-foreground hover:bg-muted"
              >
                <Facebook className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="text-foreground hover:bg-muted"
              >
                <Twitter className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="text-foreground hover:bg-muted"
              >
                <Linkedin className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="text-foreground hover:bg-muted"
              >
                <Github className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold">Quick Links</h4>
            <div className="space-y-3">
              <Link
                to="/properties"
                className="block text-muted-foreground hover:text-foreground transition-colors"
              >
                Browse Properties
              </Link>
              <Link
                to="/register"
                className="block text-muted-foreground hover:text-foreground transition-colors"
              >
                Register Property
              </Link>
              <Link
                to="/verify"
                className="block text-muted-foreground hover:text-foreground transition-colors"
              >
                Verify Ownership
              </Link>
              <Link
                to="/transfer"
                className="block text-muted-foreground hover:text-foreground transition-colors"
              >
                Transfer Property
              </Link>
              <Link
                to="/maps"
                className="block text-muted-foreground hover:text-foreground transition-colors"
              >
                Property Maps
              </Link>
            </div>
          </div>

          {/* Government */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold">Government Portal</h4>
            <div className="space-y-3">
              <Link
                to="/government"
                className="block text-muted-foreground hover:text-foreground transition-colors"
              >
                Registrar Portal
              </Link>
              <Link
                to="/admin"
                className="block text-muted-foreground hover:text-foreground transition-colors"
              >
                Admin Dashboard
              </Link>
              <Link
                to="/analytics"
                className="block text-muted-foreground hover:text-foreground transition-colors"
              >
                System Analytics
              </Link>
              <Link
                to="/documents"
                className="block text-muted-foreground hover:text-foreground transition-colors"
              >
                Legal Documents
              </Link>
              <Link
                to="/support"
                className="block text-muted-foreground hover:text-foreground transition-colors"
              >
                Support Center
              </Link>
            </div>
          </div>

          {/* Contact & Newsletter */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold">Stay Connected</h4>

            <div className="space-y-4">
              <div className="flex items-center space-x-3 text-muted-foreground">
                <Mail className="w-4 h-4" />
                <span>support@terratrust.gov.bd</span>
              </div>
              <div className="flex items-center space-x-3 text-muted-foreground">
                <Phone className="w-4 h-4" />
                <span>+880-1XXXX-XXXXX</span>
              </div>
              <div className="flex items-center space-x-3 text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>Dhaka, Bangladesh</span>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Get updates on new features and blockchain improvements
              </p>
              <div className="flex space-x-2">
                <Input
                  placeholder="Your email"
                  className="bg-background border-border text-foreground placeholder:text-muted-foreground"
                />
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-muted-foreground text-sm">
              © 2025 terraTrust Bangladesh. All rights reserved. | Powered by
              Blockchain Technology
            </div>
            <div className="flex space-x-6 text-sm">
              <Link
                to="/privacy"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Terms of Service
              </Link>
              <Link
                to="/security"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Security
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
