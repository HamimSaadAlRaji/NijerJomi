import { Button } from "@/components/ui/button";
import { Shield, Award, Users, TrendingUp } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const SecurityTrust = () => {
  const { elementRef: leftContentRef, isVisible: leftContentVisible } =
    useScrollAnimation<HTMLDivElement>();
  const { elementRef: rightContentRef, isVisible: rightContentVisible } =
    useScrollAnimation<HTMLDivElement>();
  const trustMetrics = [
    {
      icon: Shield,
      value: "256-bit",
      description: "Encryption",
    },
    {
      icon: Award,
      value: "99.9%",
      description: "Success Rate",
    },
    {
      icon: Users,
      value: "10K+",
      description: "Users",
    },
    {
      icon: TrendingUp,
      value: "50K+",
      description: "Properties",
    },
  ];

  return (
    <section className="py-32 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          {/* Left Content */}
          <div ref={leftContentRef} className="space-y-12">
            <div className="space-y-8">
              <h2
                className={`text-5xl lg:text-6xl font-bold text-black leading-tight transition-all duration-500 ${
                  leftContentVisible
                    ? "animate-fade-in-up"
                    : "opacity-0 translate-y-10"
                }`}
              >
                TRUSTED.
                <br />
                VERIFIED.
                <br />
                GLOBAL.
              </h2>
              <p
                className={`text-xl text-gray-600 leading-relaxed max-w-lg transition-all duration-500 delay-100 ${
                  leftContentVisible
                    ? "animate-fade-in-up animation-delay-200"
                    : "opacity-0 translate-y-10"
                }`}
              >
                Thousands trust us worldwide. Millions in verified transactions.
                Zero compromises on security.
              </p>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-2 gap-6">
              {trustMetrics.map((metric, index) => {
                const IconComponent = metric.icon;
                return (
                  <div
                    key={index}
                    className={`text-center p-6 border border-gray-200 rounded-lg hover:transform hover:scale-105 transition-all duration-500 hover:shadow-lg ${
                      leftContentVisible
                        ? `animate-fade-in-up animation-delay-${
                            (index + 3) * 200
                          }`
                        : "opacity-0 translate-y-10"
                    }`}
                    style={{
                      transitionDelay: leftContentVisible
                        ? `${(index + 2) * 100}ms`
                        : "0ms",
                    }}
                  >
                    <div className="flex justify-center mb-4">
                      <div className="w-12 h-12 bg-black flex items-center justify-center rounded-lg hover:rotate-12 transition-transform duration-300">
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div
                      className={`text-2xl font-bold text-black mb-1 transition-all duration-500 ${
                        leftContentVisible ? "animate-pulse" : "opacity-0"
                      }`}
                    >
                      {metric.value}
                    </div>
                    <div className="text-sm text-gray-600">
                      {metric.description}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* CTA Button */}
            <div
              className={`pt-4 transition-all duration-500 delay-500 ${
                leftContentVisible
                  ? "animate-fade-in-up animation-delay-1000"
                  : "opacity-0 translate-y-10"
              }`}
            >
              <Button
                size="lg"
                className="bg-black text-white hover:bg-gray-800 text-lg px-12 py-4 rounded-lg font-medium hover:scale-105 transition-all duration-300 hover:shadow-xl"
              >
                Secure Your Land
              </Button>
            </div>
          </div>

          {/* Right Content - Security Card */}
          <div
            ref={rightContentRef}
            className={`relative transition-all duration-500 delay-250 ${
              rightContentVisible
                ? "animate-fade-in-up animation-delay-500"
                : "opacity-0 translate-y-10"
            }`}
          >
            <div className="bg-black text-white p-10 relative rounded-lg hover:transform hover:scale-105 transition-all duration-500 hover:shadow-2xl">
              <div className="relative z-10">
                {/* Header */}
                <div
                  className={`flex items-center justify-between mb-8 transition-all duration-500 delay-350 ${
                    rightContentVisible
                      ? "animate-fade-in-up animation-delay-700"
                      : "opacity-0 translate-y-6"
                  }`}
                >
                  <div>
                    <p className="text-gray-300 text-sm mb-2">
                      Security Status
                    </p>
                    <h3
                      className={`text-3xl font-bold transition-all duration-500 ${
                        rightContentVisible ? "animate-pulse" : "opacity-0"
                      }`}
                    >
                      ACTIVE
                    </h3>
                  </div>
                  <div className="w-12 h-12 border border-white flex items-center justify-center rounded-lg hover:rotate-12 transition-transform duration-300">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                </div>

                {/* Security Metrics */}
                <div className="space-y-6 mb-8">
                  <div
                    className={`flex items-center justify-between py-4 border-b border-gray-700 hover:bg-gray-800 transition-all duration-500 delay-400 ${
                      rightContentVisible
                        ? "animate-fade-in-up animation-delay-800"
                        : "opacity-0 translate-y-4"
                    }`}
                  >
                    <span className="text-gray-300">Encryption</span>
                    <span className="font-bold">Military Grade</span>
                  </div>
                  <div
                    className={`flex items-center justify-between py-4 border-b border-gray-700 hover:bg-gray-800 transition-all duration-500 delay-450 ${
                      rightContentVisible
                        ? "animate-fade-in-up animation-delay-900"
                        : "opacity-0 translate-y-4"
                    }`}
                  >
                    <span className="text-gray-300">Network</span>
                    <div className="flex items-center space-x-2">
                      <div
                        className={`w-2 h-2 bg-white rounded-full transition-all duration-500 ${
                          rightContentVisible ? "animate-pulse" : "opacity-0"
                        }`}
                      ></div>
                      <span className="font-bold">Online</span>
                    </div>
                  </div>
                  <div
                    className={`flex items-center justify-between py-4 hover:bg-gray-800 transition-all duration-500 delay-500 ${
                      rightContentVisible
                        ? "animate-fade-in-up animation-delay-1000"
                        : "opacity-0 translate-y-4"
                    }`}
                  >
                    <span className="text-gray-300">Last Check</span>
                    <span className="font-bold">2 min ago</span>
                  </div>
                </div>

                {/* Status */}
                <div
                  className={`border border-white p-6 rounded-lg hover:border-gray-300 transition-all duration-500 delay-550 ${
                    rightContentVisible
                      ? "animate-fade-in-up animation-delay-1100"
                      : "opacity-0 translate-y-4"
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-white flex items-center justify-center rounded-lg hover:rotate-12 transition-transform duration-300">
                      <Shield className="w-5 h-5 text-black" />
                    </div>
                    <div>
                      <p className="font-semibold">All Systems Secure</p>
                      <p className="text-sm text-gray-300">Blockchain Active</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SecurityTrust;
