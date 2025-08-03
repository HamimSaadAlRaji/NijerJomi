import { Button } from "@/components/ui/button";
import {
  Clock,
  Smartphone,
  Globe,
  CheckCircle,
  ArrowRight,
  Zap,
  Shield,
  Users,
} from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import Navbar from "@/components/Navbar";

const UserBenefits = () => {
  const { elementRef: heroRef, isVisible: heroVisible } =
    useScrollAnimation<HTMLDivElement>();
  const { elementRef: benefitsRef, isVisible: benefitsVisible } =
    useScrollAnimation<HTMLDivElement>();
  const { elementRef: processRef, isVisible: processVisible } =
    useScrollAnimation<HTMLDivElement>();
  const { elementRef: featuresRef, isVisible: featuresVisible } =
    useScrollAnimation<HTMLDivElement>();
  const { elementRef: statsRef, isVisible: statsVisible } =
    useScrollAnimation<HTMLDivElement>();
  const { elementRef: ctaRef, isVisible: ctaVisible } =
    useScrollAnimation<HTMLDivElement>();

  const benefits = [
    {
      icon: Clock,
      title: "INSTANT VERIFICATION",
      before: "3-7 days processing",
      after: "2 seconds verification",
      description: "No more waiting weeks for property verification",
    },
    {
      icon: Smartphone,
      title: "MOBILE ACCESS",
      before: "Office visits required",
      after: "Anywhere, anytime",
      description: "Complete property management from your phone",
    },
    {
      icon: Globe,
      title: "24/7 AVAILABILITY",
      before: "Business hours only",
      after: "Always accessible",
      description: "Access your property data around the clock",
    },
    {
      icon: Shield,
      title: "SECURE OWNERSHIP",
      before: "Risk of document loss",
      after: "Permanent digital proof",
      description: "Your ownership is protected forever",
    },
  ];

  const processSteps = [
    {
      step: "1",
      title: "REGISTER PROPERTY",
      description: "Upload your documents once - they're secured forever",
      time: "5 minutes",
    },
    {
      step: "2",
      title: "INSTANT VERIFICATION",
      description: "Our system validates your ownership immediately",
      time: "30 seconds",
    },
    {
      step: "3",
      title: "BLOCKCHAIN RECORDING",
      description: "Your property is permanently recorded on the blockchain",
      time: "2 minutes",
    },
    {
      step: "4",
      title: "ENJOY BENEFITS",
      description: "Instant transfers, global access, complete security",
      time: "Forever",
    },
  ];

  const features = [
    {
      icon: Zap,
      title: "LIGHTNING FAST",
      items: [
        "Instant ownership verification",
        "Real-time transfer processing",
        "Immediate transaction confirmations",
      ],
    },
    {
      icon: Users,
      title: "USER FRIENDLY",
      items: [
        "Simple mobile interface",
        "No technical knowledge required",
        "24/7 customer support",
      ],
    },
    {
      icon: Shield,
      title: "ULTRA SECURE",
      items: [
        "Military-grade encryption",
        "Immutable ownership records",
        "Zero fraud possibility",
      ],
    },
  ];

  const stats = [
    { number: "99.9%", label: "Uptime Guarantee" },
    { number: "2 sec", label: "Verification Time" },
    { number: "$0", label: "Hidden Fees" },
    { number: "24/7", label: "Global Access" },
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
              EFFORTLESS OWNERSHIP
            </h1>
            <p
              className={`text-xl text-gray-300 max-w-2xl mx-auto transition-all duration-500 delay-100 ${
                heroVisible
                  ? "animate-fade-in-up animation-delay-200"
                  : "opacity-0 translate-y-10"
              }`}
            >
              Experience property ownership like never before - simple, fast,
              and completely secure.
            </p>
          </div>
        </section>

        {/* Benefits Comparison */}
        <section ref={benefitsRef} className="py-20 bg-white text-black">
          <div className="max-w-6xl mx-auto px-4">
            <h2
              className={`text-4xl lg:text-5xl font-bold text-center mb-16 transition-all duration-500 ${
                benefitsVisible
                  ? "animate-fade-in-up"
                  : "opacity-0 translate-y-10"
              }`}
            >
              BEFORE VS AFTER
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
                  <h3 className="text-xl font-bold mb-4">{benefit.title}</h3>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-red-600">Before:</span>
                      <span className="text-red-600 font-semibold">
                        {benefit.before}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-green-600">After:</span>
                      <span className="text-green-600 font-semibold">
                        {benefit.after}
                      </span>
                    </div>
                  </div>

                  <p className="text-gray-600">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section ref={processRef} className="py-20">
          <div className="max-w-6xl mx-auto px-4">
            <h2
              className={`text-4xl lg:text-5xl font-bold text-center mb-16 transition-all duration-500 ${
                processVisible
                  ? "animate-fade-in-up"
                  : "opacity-0 translate-y-10"
              }`}
            >
              HOW SIMPLE IS IT?
            </h2>

            <div className="grid md:grid-cols-4 gap-8">
              {processSteps.map((step, index) => (
                <div
                  key={index}
                  className={`text-center transition-all duration-500 ${
                    processVisible
                      ? `animate-fade-in-up animation-delay-${
                          200 + index * 100
                        }`
                      : "opacity-0 translate-y-10"
                  }`}
                  style={{
                    transitionDelay: processVisible
                      ? `${200 + index * 100}ms`
                      : "0ms",
                  }}
                >
                  <div className="w-16 h-16 bg-white text-black rounded-lg flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                    {step.step}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                  <p className="text-gray-300 mb-3">{step.description}</p>
                  <div className="text-green-400 font-semibold">
                    {step.time}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section ref={featuresRef} className="py-20 bg-white text-black">
          <div className="max-w-6xl mx-auto px-4">
            <h2
              className={`text-4xl lg:text-5xl font-bold text-center mb-16 transition-all duration-500 ${
                featuresVisible
                  ? "animate-fade-in-up"
                  : "opacity-0 translate-y-10"
              }`}
            >
              BUILT FOR YOU
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className={`p-8 border border-gray-200 rounded-lg transition-all duration-500 ${
                    featuresVisible
                      ? `animate-fade-in-up animation-delay-${
                          200 + index * 100
                        }`
                      : "opacity-0 translate-y-10"
                  }`}
                  style={{
                    transitionDelay: featuresVisible
                      ? `${200 + index * 100}ms`
                      : "0ms",
                  }}
                >
                  <feature.icon className="w-12 h-12 mb-6 text-black" />
                  <h3 className="text-2xl font-bold mb-6">{feature.title}</h3>
                  <ul className="space-y-3">
                    {feature.items.map((item, itemIndex) => (
                      <li
                        key={itemIndex}
                        className="flex items-center space-x-3"
                      >
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                        <span className="text-gray-600">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section ref={statsRef} className="py-20">
          <div className="max-w-6xl mx-auto px-4">
            <h2
              className={`text-4xl lg:text-5xl font-bold text-center mb-16 transition-all duration-500 ${
                statsVisible ? "animate-fade-in-up" : "opacity-0 translate-y-10"
              }`}
            >
              BY THE NUMBERS
            </h2>

            <div className="grid md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className={`text-center bg-white text-black p-8 rounded-lg transition-all duration-500 ${
                    statsVisible
                      ? `animate-fade-in-up animation-delay-${
                          200 + index * 100
                        }`
                      : "opacity-0 translate-y-10"
                  }`}
                  style={{
                    transitionDelay: statsVisible
                      ? `${200 + index * 100}ms`
                      : "0ms",
                  }}
                >
                  <div className="text-4xl lg:text-5xl font-bold mb-3 text-black">
                    {stat.number}
                  </div>
                  <div className="text-gray-600 font-medium">{stat.label}</div>
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
              <h3 className="text-4xl font-bold mb-6">
                READY FOR EASY OWNERSHIP?
              </h3>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                Join thousands who've simplified their property ownership
                experience.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-black text-white hover:bg-gray-800 text-lg px-12 py-4 rounded-lg font-medium hover:scale-105 transition-all duration-300"
                >
                  Start Now - It's Free
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </div>
              <p className="text-sm text-gray-500 mt-4">
                No setup fees • No hidden costs • Cancel anytime
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default UserBenefits;
