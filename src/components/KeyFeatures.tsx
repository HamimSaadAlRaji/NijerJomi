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
    <section className="py-32 bg-gradient-to-br from-[#1a5e35] via-[#5ee692] to-[#002f13]">
      <div className="max-w-5xl mx-auto px-4">
        {/* Section Header */}
        <div ref={headerRef} className="text-center mb-20">
          <h2
            className={`text-5xl lg:text-6xl font-bold text-[#f7fcf5] mb-8 transition-all duration-500 ${
              headerVisible ? "animate-fade-in-up" : "opacity-0 translate-y-10"
            }`}
          >
            ELEVATE OWNERSHIP
          </h2>
          <p
            className={`text-xl text-[#465465] max-w-2xl mx-auto transition-all duration-500 delay-100 ${
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
                <div className="bg-[#f7fcf5] text-[#006d2c] p-8 h-64 hover:bg-[#e5f5e0] transition-all duration-500 rounded-lg hover:transform hover:scale-105 hover:shadow-xl">
                  {/* Icon */}
                  <div className="w-12 h-12 bg-[#238b45] flex items-center justify-center mb-6 rounded-lg group-hover:rotate-6 transition-transform duration-300">
                    <IconComponent className="w-6 h-6 text-[#f7fcf5]" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold mb-4 text-[#465465] group-hover:text-[#00441b] transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-[#238b45] text-sm leading-relaxed">
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
              className={`text-[#c7e9c0] font-medium text-lg transition-all duration-500 delay-350 ${
                ctaVisible ? "animate-pulse" : "opacity-0"
              }`}
            >
              Ready?
            </span>
            <button
              className={`bg-[#f7fcf5] text-[#006d2c] px-8 py-3 font-medium hover:bg-[#e5f5e0] hover:text-[#00441b] transition-all duration-500 delay-400 rounded-lg hover:scale-105 hover:shadow-lg ${
                ctaVisible ? "opacity-100" : "opacity-0 translate-y-4"
              }`}
            >
              Connect Wallet
            </button>
            <button
              className={`border border-[#c7e9c0] text-[#c7e9c0] px-8 py-3 font-medium hover:bg-[#c7e9c0] hover:text-[#006d2c] transition-all duration-500 delay-450 rounded-lg hover:scale-105 ${
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
