import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import PlatformOverview from "@/components/PlatformOverview";
import KeyFeatures from "@/components/KeyFeatures";
import SecurityTrust from "@/components/SecurityTrust";
import GlobalReach from "@/components/GlobalReach";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <PlatformOverview />
      <KeyFeatures />
      <SecurityTrust />
      <GlobalReach />
      <Footer />
    </div>
  );
};

export default Index;
