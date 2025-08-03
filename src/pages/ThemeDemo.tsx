import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import ThemeToggle from "@/components/ThemeToggle";
import {
  Check,
  X,
  AlertCircle,
  Info,
  Clock,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

const ThemeDemo = () => {
  const { toast } = useToast();

  const showSuccessToast = () => {
    toast({
      title: "Success!",
      description: "This is a success message with light green background.",
      variant: "success" as any,
    });
  };

  const showErrorToast = () => {
    toast({
      title: "Error!",
      description: "This is an error message with light red background.",
      variant: "destructive",
    });
  };

  const showWarningToast = () => {
    toast({
      title: "Warning!",
      description: "This is a warning message with light orange background.",
      variant: "warning" as any,
    });
  };

  const showInfoToast = () => {
    toast({
      title: "Information",
      description: "This is an info message with light blue background.",
      variant: "info" as any,
    });
  };

  const showDefaultToast = () => {
    toast({
      title: "Information",
      description: "This is a default message with white background.",
    });
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">
              Black & White Theme Demo
            </h1>
            <p className="text-muted-foreground">
              Showcasing the new clean black and white theme with customizable
              colors
            </p>
          </div>
          <ThemeToggle />
        </div>

        {/* Color Variables Display */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Theme Colors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="text-center">
                <div className="w-16 h-16 bg-background border border-border rounded-lg mx-auto mb-2"></div>
                <p className="text-sm font-medium">Background</p>
                <p className="text-xs text-muted-foreground">White</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary rounded-lg mx-auto mb-2"></div>
                <p className="text-sm font-medium">Primary</p>
                <p className="text-xs text-muted-foreground">Black</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-success rounded-lg mx-auto mb-2"></div>
                <p className="text-sm font-medium">Success</p>
                <p className="text-xs text-muted-foreground">Light Green</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-warning rounded-lg mx-auto mb-2"></div>
                <p className="text-sm font-medium">Warning</p>
                <p className="text-xs text-muted-foreground">Light Orange</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-info rounded-lg mx-auto mb-2"></div>
                <p className="text-sm font-medium">Info</p>
                <p className="text-xs text-muted-foreground">Light Blue</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-destructive rounded-lg mx-auto mb-2"></div>
                <p className="text-sm font-medium">Error</p>
                <p className="text-xs text-muted-foreground">Light Red</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Status Colors */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Status Colors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <div className="text-center">
                <div className="w-16 h-16 bg-property-verified rounded-lg mx-auto mb-2"></div>
                <p className="text-sm font-medium">Verified</p>
                <p className="text-xs text-muted-foreground">Light Green</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-property-pending rounded-lg mx-auto mb-2"></div>
                <p className="text-sm font-medium">Pending</p>
                <p className="text-xs text-muted-foreground">Light Yellow</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-property-approved rounded-lg mx-auto mb-2"></div>
                <p className="text-sm font-medium">Approved</p>
                <p className="text-xs text-muted-foreground">Light Teal</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-property-disputed rounded-lg mx-auto mb-2"></div>
                <p className="text-sm font-medium">Disputed</p>
                <p className="text-xs text-muted-foreground">
                  Light Orange-Red
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-property-rejected rounded-lg mx-auto mb-2"></div>
                <p className="text-sm font-medium">Rejected</p>
                <p className="text-xs text-muted-foreground">Light Red</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Buttons */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Buttons</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <Button>Primary Button</Button>
              <Button variant="outline">Outline Button</Button>
              <Button variant="secondary">Secondary Button</Button>
              <Button variant="ghost">Ghost Button</Button>
              <Button variant="destructive">Destructive Button</Button>
            </div>
          </CardContent>
        </Card>

        {/* Badges */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Status Badges</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <Badge>Default Badge</Badge>
              <Badge variant="outline">Outline Badge</Badge>
              <Badge variant="secondary">Secondary Badge</Badge>
              <Badge variant="destructive">Destructive Badge</Badge>
              <Badge className="bg-success text-success-foreground">
                <CheckCircle2 className="w-3 h-3 mr-1" />
                Success
              </Badge>
              <Badge className="bg-warning text-warning-foreground">
                <Clock className="w-3 h-3 mr-1" />
                Warning
              </Badge>
              <Badge className="bg-info text-info-foreground">
                <Info className="w-3 h-3 mr-1" />
                Info
              </Badge>
              <Badge className="bg-property-verified text-property-verified-foreground">
                <Check className="w-3 h-3 mr-1" />
                Verified
              </Badge>
              <Badge className="bg-property-pending text-property-pending-foreground">
                <Clock className="w-3 h-3 mr-1" />
                Pending
              </Badge>
              <Badge className="bg-property-approved text-property-approved-foreground">
                <CheckCircle2 className="w-3 h-3 mr-1" />
                Approved
              </Badge>
              <Badge className="bg-property-disputed text-property-disputed-foreground">
                <AlertTriangle className="w-3 h-3 mr-1" />
                Disputed
              </Badge>
              <Badge className="bg-property-rejected text-property-rejected-foreground">
                <X className="w-3 h-3 mr-1" />
                Rejected
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Form Elements */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Form Elements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" placeholder="Enter your email" />
              </div>
              <div>
                <Label htmlFor="name">Name</Label>
                <Input id="name" placeholder="Enter your name" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Toast Demos */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Toast Notifications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <Button
                onClick={showSuccessToast}
                className="bg-success text-success-foreground hover:bg-success/90"
              >
                <Check className="w-4 h-4 mr-2" />
                Success Toast
              </Button>
              <Button
                onClick={showWarningToast}
                className="bg-warning text-warning-foreground hover:bg-warning/90"
              >
                <AlertTriangle className="w-4 h-4 mr-2" />
                Warning Toast
              </Button>
              <Button
                onClick={showInfoToast}
                className="bg-info text-info-foreground hover:bg-info/90"
              >
                <Info className="w-4 h-4 mr-2" />
                Info Toast
              </Button>
              <Button onClick={showErrorToast} variant="destructive">
                <X className="w-4 h-4 mr-2" />
                Error Toast
              </Button>
              <Button onClick={showDefaultToast} variant="outline">
                <AlertCircle className="w-4 h-4 mr-2" />
                Default Toast
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* CSS Variables Reference */}
        <Card>
          <CardHeader>
            <CardTitle>CSS Variables Reference</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-muted p-4 rounded-lg">
              <h4 className="font-medium mb-2">Base Theme Variables:</h4>
              <ul className="text-sm text-muted-foreground space-y-1 mb-4">
                <li>
                  <code>--theme-white: 0 0% 100%</code> - Pure white
                </li>
                <li>
                  <code>--theme-black: 0 0% 0%</code> - Pure black
                </li>
                <li>
                  <code>--theme-gray-light: 0 0% 95%</code> - Light gray
                </li>
                <li>
                  <code>--theme-gray-medium: 0 0% 85%</code> - Medium gray
                </li>
                <li>
                  <code>--theme-gray-dark: 0 0% 60%</code> - Dark gray
                </li>
              </ul>

              <h4 className="font-medium mb-2">Status Colors:</h4>
              <ul className="text-sm text-muted-foreground space-y-1 mb-4">
                <li>
                  <code>--theme-success: 120 60% 90%</code> - Light green
                  background
                </li>
                <li>
                  <code>--theme-success-foreground: 120 100% 25%</code> - Dark
                  green text
                </li>
                <li>
                  <code>--theme-warning: 45 95% 85%</code> - Light orange
                  background
                </li>
                <li>
                  <code>--theme-warning-foreground: 45 100% 35%</code> - Dark
                  orange text
                </li>
                <li>
                  <code>--theme-info: 210 60% 90%</code> - Light blue background
                </li>
                <li>
                  <code>--theme-info-foreground: 210 100% 30%</code> - Dark blue
                  text
                </li>
                <li>
                  <code>--theme-error: 0 60% 90%</code> - Light red background
                </li>
                <li>
                  <code>--theme-error-foreground: 0 100% 40%</code> - Dark red
                  text
                </li>
              </ul>

              <h4 className="font-medium mb-2">Property Status Colors:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>
                  <code>--theme-verified: 120 60% 90%</code> - Verified status
                </li>
                <li>
                  <code>--theme-pending: 45 95% 85%</code> - Pending status
                </li>
                <li>
                  <code>--theme-approved: 160 60% 85%</code> - Approved status
                </li>
                <li>
                  <code>--theme-disputed: 15 85% 90%</code> - Disputed status
                </li>
                <li>
                  <code>--theme-rejected: 0 60% 90%</code> - Rejected status
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ThemeDemo;
