import React from "react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Sparkles } from "lucide-react";

const ComingSoon = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center relative mt-20">
        {/* Decorative background gradient */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="w-full h-full bg-gradient-to-br from-white via-blue-50 to-gray-100 dark:from-black dark:via-slate-900 dark:to-slate-800 opacity-80" />
        </div>
        <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 py-12">
          <Sparkles className="w-16 h-16 mb-6 text-primary animate-bounce" />
          <h1 className="text-5xl font-extrabold text-foreground mb-4 tracking-tight drop-shadow-lg">
            Coming Soon
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-xl mx-auto">
            This page is under construction and will be available soon.<br />
            Stay tuned for exciting new features!
          </p>
          <Button variant="outline" size="lg" onClick={() => window.location.href = "/"}>
            Go Back Home
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ComingSoon;