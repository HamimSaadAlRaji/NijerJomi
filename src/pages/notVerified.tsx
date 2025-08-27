import React from "react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ShieldAlert } from "lucide-react";

const NotVerified = () => {
	return (
		<div className="min-h-screen bg-background flex flex-col">
			<Navbar />
			<main className="flex-1 flex flex-col items-center justify-center relative mt-20">
				{/* Decorative background gradient */}
				<div className="absolute inset-0 pointer-events-none z-0">
					<div className="w-full h-full bg-gradient-to-br from-white via-blue-50 to-gray-100 dark:from-black dark:via-slate-900 dark:to-slate-800 opacity-80" />
				</div>
				<div className="relative z-10 flex flex-col items-center justify-center text-center px-4 py-12">
					<ShieldAlert className="w-16 h-16 mb-6 text-red-600 dark:text-red-500 animate-pulse" />
					<h1 className="text-4xl font-bold text-foreground mb-4 tracking-tight drop-shadow-lg">
						Account Not Verified
					</h1>
					<p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
						Your account verification is currently in process.<br />
						Once an admin reviews your registration, you will gain full access.<br />
						Thank you for your patience!
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

export default NotVerified;
