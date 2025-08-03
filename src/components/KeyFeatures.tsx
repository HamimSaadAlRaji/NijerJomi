import { Shield, Users, Globe, Zap, Lock, FileCheck } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const KeyFeatures = () => {
  const { elementRef: headerRef, isVisible: headerVisible } =
    useScrollAnimation<HTMLDivElement>();
  const { elementRef: gridRef, isVisible: gridVisible } =
    useScrollAnimation<HTMLDivElement>();
  const { elementRef: ctaRef, isVisible: ctaVisible } =
    useScrollAnimation<HTMLDivElement>();
  const features = [
    {
      icon: Shield,
      title: "Blockchain Security",
      description: "Immutable records. Zero tampering. Maximum protection.",
    },
    {
      icon: FileCheck,
      title: "Smart Automation",
      description: "Instant verification. No paperwork. Minutes, not months.",
    },
    {
      icon: Globe,
      title: "Global Access",
      description: "Anywhere. Anytime. No boundaries.",
    },
    {
      icon: Users,
      title: "Multi-Role System",
      description: "Citizens. Officials. Administrators. All connected.",
    },
    {
      icon: Zap,
      title: "Real-Time",
      description: "Live verification. Instant confirmation.",
    },
    {
      icon: Lock,
      title: "Privacy First",
      description: "Encrypted data. Transparent process.",
    },
  ];

  return (
    <section className="py-32 bg-black">
      <div className="max-w-5xl mx-auto px-4">
        {/* Section Header */}
        <div ref={headerRef} className="text-center mb-20">
          <h2
            className={`text-5xl lg:text-6xl font-bold text-white mb-8 transition-all duration-500 ${
              headerVisible ? "animate-fade-in-up" : "opacity-0 translate-y-10"
            }`}
          >
            ELEVATE OWNERSHIP
          </h2>
          <p
            className={`text-xl text-gray-300 max-w-2xl mx-auto transition-all duration-500 delay-100 ${
              headerVisible
                ? "animate-fade-in-up animation-delay-200"
                : "opacity-0 translate-y-10"
            }`}
          >
            Future-ready. Blockchain-powered. Globally trusted.
          </p>
        </div>

        {/* Features Grid */}
        <div ref={gridRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div
                key={index}
                className={`group transition-all duration-500 ${
                  gridVisible
                    ? `animate-fade-in-up animation-delay-${(index + 3) * 100}`
                    : "opacity-0 translate-y-10"
                }`}
                style={{
                  transitionDelay: gridVisible
                    ? `${(index + 1) * 50}ms`
                    : "0ms",
                }}
              >
                <div className="bg-white text-black p-8 h-64 hover:bg-gray-100 transition-all duration-500 rounded-lg hover:transform hover:scale-105 hover:shadow-xl">
                  {/* Icon */}
                  <div className="w-12 h-12 bg-black flex items-center justify-center mb-6 rounded-lg group-hover:rotate-6 transition-transform duration-300">
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold mb-4 group-hover:text-gray-800 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div
          ref={ctaRef}
          className={`text-center mt-20 transition-all duration-500 delay-300 ${
            ctaVisible
              ? "animate-fade-in-up animation-delay-1200"
              : "opacity-0 translate-y-10"
          }`}
        >
          <div className="inline-flex items-center space-x-6">
            <span
              className={`text-white font-medium text-lg transition-all duration-500 delay-350 ${
                ctaVisible ? "animate-pulse" : "opacity-0"
              }`}
            >
              Ready?
            </span>
            <button
              className={`bg-white text-black px-8 py-3 font-medium hover:bg-gray-200 transition-all duration-500 delay-400 rounded-lg hover:scale-105 hover:shadow-lg ${
                ctaVisible ? "opacity-100" : "opacity-0 translate-y-4"
              }`}
            >
              Connect Wallet
            </button>
            <button
              className={`border border-white text-white px-8 py-3 font-medium hover:bg-white hover:text-black transition-all duration-500 delay-450 rounded-lg hover:scale-105 ${
                ctaVisible ? "opacity-100" : "opacity-0 translate-y-4"
              }`}
            >
              Learn More
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default KeyFeatures;
