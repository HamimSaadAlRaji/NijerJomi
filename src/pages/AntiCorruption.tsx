import { Button } from "@/components/ui/button";
import {
  Shield,
  Eye,
  Users,
  CheckCircle,
  XCircle,
  ArrowRight,
} from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import Navbar from "@/components/Navbar";

const AntiCorruption = () => {
  const { elementRef: heroRef, isVisible: heroVisible } =
    useScrollAnimation<HTMLDivElement>();
  const { elementRef: problemRef, isVisible: problemVisible } =
    useScrollAnimation<HTMLDivElement>();
  const { elementRef: solutionRef, isVisible: solutionVisible } =
    useScrollAnimation<HTMLDivElement>();
  const { elementRef: featuresRef, isVisible: featuresVisible } =
    useScrollAnimation<HTMLDivElement>();
  const { elementRef: comparisonRef, isVisible: comparisonVisible } =
    useScrollAnimation<HTMLDivElement>();
  const { elementRef: ctaRef, isVisible: ctaVisible } =
    useScrollAnimation<HTMLDivElement>();

  const corruptionProblems = [
    {
      title: "DOCUMENT FORGERY",
      description: "Fake property deeds and ownership papers",
      impact: "$2.3B lost annually",
    },
    {
      title: "BRIBERY & KICKBACKS",
      description: "Officials demanding payments for approvals",
      impact: "45% of transactions affected",
    },
    {
      title: "INSIDER MANIPULATION",
      description: "Unauthorized changes to official records",
      impact: "1 in 8 properties disputed",
    },
    {
      title: "LACK OF OVERSIGHT",
      description: "No public access to transaction history",
      impact: "Zero transparency",
    },
  ];

  const solutions = [
    {
      icon: Eye,
      title: "COMPLETE TRANSPARENCY",
      description: "Every transaction is publicly visible and verifiable",
      benefit: "100% audit trail",
    },
    {
      icon: Shield,
      title: "TAMPER-PROOF RECORDS",
      description: "Impossible to alter or delete historical data",
      benefit: "Zero fraud risk",
    },
    {
      icon: Users,
      title: "DECENTRALIZED VALIDATION",
      description: "No single authority controls the system",
      benefit: "Eliminates corruption",
    },
  ];

  const comparison = [
    {
      feature: "Record Tampering",
      traditional: "Easy to modify",
      blockchain: "Impossible to alter",
      traditionalIcon: XCircle,
      blockchainIcon: CheckCircle,
    },
    {
      feature: "Transaction Visibility",
      traditional: "Private/Hidden",
      blockchain: "Fully Transparent",
      traditionalIcon: XCircle,
      blockchainIcon: CheckCircle,
    },
    {
      feature: "Authority Control",
      traditional: "Single Point",
      blockchain: "Distributed Network",
      traditionalIcon: XCircle,
      blockchainIcon: CheckCircle,
    },
    {
      feature: "Verification Time",
      traditional: "Days/Weeks",
      blockchain: "Instant",
      traditionalIcon: XCircle,
      blockchainIcon: CheckCircle,
    },
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-black text-white pt-16">
        {/* Hero Section */}
        <section ref={heroRef} className="py-32">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h1
              className={`text-6xl lg:text-7xl font-bold mb-8 transition-all duration-500 ${
                heroVisible ? "animate-fade-in-up" : "opacity-0 translate-y-10"
              }`}
            >
              ENDING CORRUPTION
            </h1>
            <p
              className={`text-xl text-gray-300 max-w-2xl mx-auto transition-all duration-500 delay-100 ${
                heroVisible
                  ? "animate-fade-in-up animation-delay-200"
                  : "opacity-0 translate-y-10"
              }`}
            >
              How blockchain technology eliminates fraud and creates trust in
              property ownership.
            </p>
          </div>
        </section>

        {/* Problem Section */}
        <section ref={problemRef} className="py-20 bg-white text-black">
          <div className="max-w-6xl mx-auto px-4">
            <h2
              className={`text-4xl lg:text-5xl font-bold text-center mb-16 transition-all duration-500 ${
                problemVisible
                  ? "animate-fade-in-up"
                  : "opacity-0 translate-y-10"
              }`}
            >
              CORRUPTION COSTS BILLIONS
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              {corruptionProblems.map((problem, index) => (
                <div
                  key={index}
                  className={`p-8 border border-red-200 bg-red-50 rounded-lg transition-all duration-500 ${
                    problemVisible
                      ? `animate-fade-in-up animation-delay-${
                          200 + index * 100
                        }`
                      : "opacity-0 translate-y-10"
                  }`}
                  style={{
                    transitionDelay: problemVisible
                      ? `${200 + index * 100}ms`
                      : "0ms",
                  }}
                >
                  <XCircle className="w-12 h-12 text-red-600 mb-4" />
                  <h3 className="text-xl font-bold mb-3 text-red-800">
                    {problem.title}
                  </h3>
                  <p className="text-gray-700 mb-3">{problem.description}</p>
                  <div className="text-red-600 font-bold">{problem.impact}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Solution Section */}
        <section ref={solutionRef} className="py-20">
          <div className="max-w-6xl mx-auto px-4">
            <h2
              className={`text-4xl lg:text-5xl font-bold text-center mb-16 transition-all duration-500 ${
                solutionVisible
                  ? "animate-fade-in-up"
                  : "opacity-0 translate-y-10"
              }`}
            >
              BLOCKCHAIN ELIMINATES CORRUPTION
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              {solutions.map((solution, index) => (
                <div
                  key={index}
                  className={`bg-white text-black p-8 rounded-lg hover:shadow-xl transition-all duration-500 ${
                    solutionVisible
                      ? `animate-fade-in-up animation-delay-${
                          200 + index * 100
                        }`
                      : "opacity-0 translate-y-10"
                  }`}
                  style={{
                    transitionDelay: solutionVisible
                      ? `${200 + index * 100}ms`
                      : "0ms",
                  }}
                >
                  <solution.icon className="w-12 h-12 mb-4 text-green-600" />
                  <h3 className="text-xl font-bold mb-3">{solution.title}</h3>
                  <p className="text-gray-600 mb-4">{solution.description}</p>
                  <div className="text-green-600 font-bold">
                    {solution.benefit}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section ref={featuresRef} className="py-20 bg-white text-black">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2
              className={`text-4xl lg:text-5xl font-bold mb-16 transition-all duration-500 ${
                featuresVisible
                  ? "animate-fade-in-up"
                  : "opacity-0 translate-y-10"
              }`}
            >
              HOW WE PREVENT FRAUD
            </h2>

            <div
              className={`bg-black text-white p-12 rounded-lg transition-all duration-500 delay-200 ${
                featuresVisible
                  ? "animate-fade-in-up animation-delay-300"
                  : "opacity-0 translate-y-10"
              }`}
            >
              <div className="grid md:grid-cols-2 gap-8 text-left">
                <div>
                  <h4 className="text-xl font-bold mb-4 text-green-400">
                    CRYPTOGRAPHIC HASHING
                  </h4>
                  <p className="text-gray-300 mb-6">
                    Each property record gets a unique digital fingerprint. Any
                    attempt to change data creates a completely different hash,
                    immediately exposing tampering.
                  </p>
                </div>
                <div>
                  <h4 className="text-xl font-bold mb-4 text-green-400">
                    CONSENSUS MECHANISM
                  </h4>
                  <p className="text-gray-300 mb-6">
                    Thousands of nodes must agree before any transaction is
                    recorded. No single person or entity can manipulate the
                    system.
                  </p>
                </div>
                <div>
                  <h4 className="text-xl font-bold mb-4 text-green-400">
                    IMMUTABLE LEDGER
                  </h4>
                  <p className="text-gray-300 mb-6">
                    Once data is written to the blockchain, it becomes
                    permanent. Historical records cannot be altered, deleted, or
                    hidden.
                  </p>
                </div>
                <div>
                  <h4 className="text-xl font-bold mb-4 text-green-400">
                    PUBLIC VERIFICATION
                  </h4>
                  <p className="text-gray-300">
                    Anyone can verify property ownership and transaction
                    history. Complete transparency eliminates backroom deals and
                    hidden transfers.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Comparison Section */}
        <section ref={comparisonRef} className="py-20">
          <div className="max-w-6xl mx-auto px-4">
            <h2
              className={`text-4xl lg:text-5xl font-bold text-center mb-16 transition-all duration-500 ${
                comparisonVisible
                  ? "animate-fade-in-up"
                  : "opacity-0 translate-y-10"
              }`}
            >
              TRADITIONAL VS BLOCKCHAIN
            </h2>

            <div className="space-y-6">
              {comparison.map((item, index) => (
                <div
                  key={index}
                  className={`bg-white text-black p-8 rounded-lg transition-all duration-500 ${
                    comparisonVisible
                      ? `animate-fade-in-up animation-delay-${
                          200 + index * 100
                        }`
                      : "opacity-0 translate-y-10"
                  }`}
                  style={{
                    transitionDelay: comparisonVisible
                      ? `${200 + index * 100}ms`
                      : "0ms",
                  }}
                >
                  <div className="grid md:grid-cols-3 gap-8 items-center">
                    <div>
                      <h3 className="text-xl font-bold">{item.feature}</h3>
                    </div>
                    <div className="flex items-center space-x-3">
                      <item.traditionalIcon className="w-6 h-6 text-red-600" />
                      <span className="text-red-700">{item.traditional}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <item.blockchainIcon className="w-6 h-6 text-green-600" />
                      <span className="text-green-700 font-semibold">
                        {item.blockchain}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section ref={ctaRef} className="py-20 bg-white text-black">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <div
              className={`p-12 transition-all duration-500 ${
                ctaVisible ? "animate-fade-in-up" : "opacity-0 translate-y-10"
              }`}
            >
              <h3 className="text-4xl font-bold mb-6">TRUST GUARANTEED</h3>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                Be part of the corruption-free future of property ownership.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-black text-white hover:bg-gray-800 text-lg px-12 py-4 rounded-lg font-medium hover:scale-105 transition-all duration-300"
                >
                  Secure Your Property
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default AntiCorruption;
