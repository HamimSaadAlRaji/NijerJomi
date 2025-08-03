import { Button } from "@/components/ui/button";
import {
  Shield,
  Database,
  Clock,
  Globe,
  CheckCircle,
  ArrowRight,
} from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import Navbar from "@/components/Navbar";

const WhyBlockchain = () => {
  const { elementRef: heroRef, isVisible: heroVisible } =
    useScrollAnimation<HTMLDivElement>();
  const { elementRef: problemRef, isVisible: problemVisible } =
    useScrollAnimation<HTMLDivElement>();
  const { elementRef: solutionRef, isVisible: solutionVisible } =
    useScrollAnimation<HTMLDivElement>();
  const { elementRef: benefitsRef, isVisible: benefitsVisible } =
    useScrollAnimation<HTMLDivElement>();
  const { elementRef: ctaRef, isVisible: ctaVisible } =
    useScrollAnimation<HTMLDivElement>();

  const problems = [
    {
      title: "PAPER RECORDS",
      description: "Lost, damaged, or falsified documents",
      icon: "📄",
    },
    {
      title: "MANUAL PROCESSES",
      description: "Slow, error-prone verification systems",
      icon: "✋",
    },
    {
      title: "CENTRALIZED CONTROL",
      description: "Single points of failure and manipulation",
      icon: "🏛️",
    },
    {
      title: "LACK OF TRANSPARENCY",
      description: "Hidden transactions and unclear ownership",
      icon: "🔒",
    },
  ];

  const benefits = [
    {
      icon: Database,
      title: "IMMUTABLE RECORDS",
      description: "Data cannot be altered once recorded",
    },
    {
      icon: Shield,
      title: "CRYPTOGRAPHIC SECURITY",
      description: "Advanced encryption protects all transactions",
    },
    {
      icon: Clock,
      title: "INSTANT VERIFICATION",
      description: "Real-time property status and ownership checks",
    },
    {
      icon: Globe,
      title: "GLOBAL ACCESSIBILITY",
      description: "24/7 access from anywhere in the world",
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
              WHY BLOCKCHAIN?
            </h1>
            <p
              className={`text-xl text-gray-300 max-w-2xl mx-auto transition-all duration-500 delay-100 ${
                heroVisible
                  ? "animate-fade-in-up animation-delay-200"
                  : "opacity-0 translate-y-10"
              }`}
            >
              The technology that's revolutionizing property ownership forever.
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
              TRADITIONAL PROBLEMS
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {problems.map((problem, index) => (
                <div
                  key={index}
                  className={`text-center p-6 border border-gray-200 rounded-lg hover:shadow-lg transition-all duration-500 ${
                    problemVisible
                      ? `animate-fade-in-up animation-delay-${
                          300 + index * 100
                        }`
                      : "opacity-0 translate-y-10"
                  }`}
                  style={{
                    transitionDelay: problemVisible
                      ? `${300 + index * 100}ms`
                      : "0ms",
                  }}
                >
                  <div className="text-4xl mb-4">{problem.icon}</div>
                  <h3 className="text-lg font-bold mb-3">{problem.title}</h3>
                  <p className="text-gray-600">{problem.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Solution Section */}
        <section ref={solutionRef} className="py-20">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2
              className={`text-4xl lg:text-5xl font-bold mb-8 transition-all duration-500 ${
                solutionVisible
                  ? "animate-fade-in-up"
                  : "opacity-0 translate-y-10"
              }`}
            >
              BLOCKCHAIN SOLUTION
            </h2>
            <p
              className={`text-xl text-gray-300 mb-12 transition-all duration-500 delay-100 ${
                solutionVisible
                  ? "animate-fade-in-up animation-delay-200"
                  : "opacity-0 translate-y-10"
              }`}
            >
              A distributed ledger that creates an unbreakable chain of property
              records.
            </p>

            <div
              className={`bg-white text-black p-12 rounded-lg transition-all duration-500 delay-200 ${
                solutionVisible
                  ? "animate-fade-in-up animation-delay-300"
                  : "opacity-0 translate-y-10"
              }`}
            >
              <h3 className="text-2xl font-bold mb-6">HOW IT WORKS</h3>
              <div className="grid md:grid-cols-3 gap-8 text-left">
                <div>
                  <div className="w-12 h-12 bg-black text-white rounded-lg flex items-center justify-center mb-4 font-bold">
                    1
                  </div>
                  <h4 className="font-bold mb-2">RECORD CREATION</h4>
                  <p className="text-gray-600">
                    Property data is encrypted and stored across multiple nodes
                  </p>
                </div>
                <div>
                  <div className="w-12 h-12 bg-black text-white rounded-lg flex items-center justify-center mb-4 font-bold">
                    2
                  </div>
                  <h4 className="font-bold mb-2">NETWORK VALIDATION</h4>
                  <p className="text-gray-600">
                    Thousands of computers verify and approve each transaction
                  </p>
                </div>
                <div>
                  <div className="w-12 h-12 bg-black text-white rounded-lg flex items-center justify-center mb-4 font-bold">
                    3
                  </div>
                  <h4 className="font-bold mb-2">PERMANENT STORAGE</h4>
                  <p className="text-gray-600">
                    Data becomes immutable and publicly verifiable
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section ref={benefitsRef} className="py-20 bg-white text-black">
          <div className="max-w-6xl mx-auto px-4">
            <h2
              className={`text-4xl lg:text-5xl font-bold text-center mb-16 transition-all duration-500 ${
                benefitsVisible
                  ? "animate-fade-in-up"
                  : "opacity-0 translate-y-10"
              }`}
            >
              BLOCKCHAIN BENEFITS
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className={`p-8 border border-gray-200 rounded-lg hover:shadow-lg transition-all duration-500 ${
                    benefitsVisible
                      ? `animate-fade-in-up animation-delay-${
                          200 + index * 100
                        }`
                      : "opacity-0 translate-y-10"
                  }`}
                  style={{
                    transitionDelay: benefitsVisible
                      ? `${200 + index * 100}ms`
                      : "0ms",
                  }}
                >
                  <benefit.icon className="w-12 h-12 mb-4 text-black" />
                  <h3 className="text-xl font-bold mb-3">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section ref={ctaRef} className="py-20">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <div
              className={`bg-white text-black p-12 rounded-lg transition-all duration-500 ${
                ctaVisible ? "animate-fade-in-up" : "opacity-0 translate-y-10"
              }`}
            >
              <h3 className="text-4xl font-bold mb-6">
                READY TO EXPERIENCE THE FUTURE?
              </h3>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                Join thousands of property owners who trust blockchain
                technology.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-black text-white hover:bg-gray-800 text-lg px-12 py-4 rounded-lg font-medium hover:scale-105 transition-all duration-300"
                >
                  Get Started Now
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

export default WhyBlockchain;
