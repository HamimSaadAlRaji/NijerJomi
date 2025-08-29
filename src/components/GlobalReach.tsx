import { Button } from "@/components/ui/button";
import { Globe, MapPin, Clock, Users } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const GlobalReach = () => {
  const { elementRef: headerRef, isVisible: headerVisible } =
    useScrollAnimation<HTMLDivElement>();
  const { elementRef: statsRef, isVisible: statsVisible } =
    useScrollAnimation<HTMLDivElement>();
  const { elementRef: countryRef, isVisible: countryVisible } =
    useScrollAnimation<HTMLDivElement>();
  const { elementRef: ctaRef, isVisible: ctaVisible } =
    useScrollAnimation<HTMLDivElement>();
  const globalStats = [
    {
      country: "United States",
      users: "2.5K",
      flag: "🇺🇸",
    },
    {
      country: "United Kingdom",
      users: "1.8K",
      flag: "🇬🇧",
    },
    {
      country: "Canada",
      users: "1.2K",
      flag: "🇨🇦",
    },
    {
      country: "Australia",
      users: "950",
      flag: "🇦🇺",
    },
  ];

  return (
    <section className="py-32 bg-gradient-to-br from-[#1a5e35] via-[#5ee692] to-[#002f13]">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <div ref={headerRef} className="text-center mb-20">
          <h2
            className={`text-5xl lg:text-6xl font-bold text-[#f7fcf5] mb-8 transition-all duration-500 ${
              headerVisible ? "animate-fade-in-up" : "opacity-0 translate-y-10"
            }`}
          >
            GLOBAL TRUST
          </h2>
          <p
            className={`text-xl text-[#c7e9c0] max-w-2xl mx-auto transition-all duration-500 delay-100 ${
              headerVisible
                ? "animate-fade-in-up animation-delay-200"
                : "opacity-0 translate-y-10"
            }`}
          >
            Worldwide adoption. Universal access. Borderless verification.
          </p>
        </div>

        {/* Global Stats Overview */}
        <div ref={statsRef} className="grid md:grid-cols-4 gap-8 mb-20">
          <div
            className={`text-center hover:transform hover:scale-105 transition-all duration-500 delay-200 ${
              statsVisible
                ? "animate-fade-in-up animation-delay-400"
                : "opacity-0 translate-y-10"
            }`}
          >
            <div className="w-16 h-16 bg-[#c7e9c0] flex items-center justify-center mx-auto mb-4 rounded-lg hover:rotate-12 transition-transform duration-300">
              <Globe className="w-8 h-8 text-[#006d2c]" />
            </div>
            <div
              className={`text-3xl font-bold text-[#f7fcf5] mb-2 transition-all duration-500 ${
                statsVisible ? "animate-pulse" : "opacity-0"
              }`}
            >
              50+
            </div>
            <div className="text-[#a1d99b] text-sm">Countries</div>
          </div>

          <div
            className={`text-center hover:transform hover:scale-105 transition-all duration-500 delay-250 ${
              statsVisible
                ? "animate-fade-in-up animation-delay-500"
                : "opacity-0 translate-y-10"
            }`}
          >
            <div className="w-16 h-16 bg-[#c7e9c0] flex items-center justify-center mx-auto mb-4 rounded-lg hover:rotate-12 transition-transform duration-300">
              <Users className="w-8 h-8 text-[#006d2c]" />
            </div>
            <div
              className={`text-3xl font-bold text-[#f7fcf5] mb-2 transition-all duration-500 ${
                statsVisible ? "animate-pulse" : "opacity-0"
              }`}
            >
              10K+
            </div>
            <div className="text-[#a1d99b] text-sm">Users</div>
          </div>

          <div
            className={`text-center hover:transform hover:scale-105 transition-all duration-500 delay-300 ${
              statsVisible
                ? "animate-fade-in-up animation-delay-600"
                : "opacity-0 translate-y-10"
            }`}
          >
            <div className="w-16 h-16 bg-[#c7e9c0] flex items-center justify-center mx-auto mb-4 rounded-lg hover:rotate-12 transition-transform duration-300">
              <MapPin className="w-8 h-8 text-[#006d2c]" />
            </div>
            <div
              className={`text-3xl font-bold text-[#f7fcf5] mb-2 transition-all duration-500 ${
                statsVisible ? "animate-pulse" : "opacity-0"
              }`}
            >
              75K+
            </div>
            <div className="text-[#a1d99b] text-sm">Properties</div>
          </div>

          <div
            className={`text-center hover:transform hover:scale-105 transition-all duration-500 delay-350 ${
              statsVisible
                ? "animate-fade-in-up animation-delay-700"
                : "opacity-0 translate-y-10"
            }`}
          >
            <div className="w-16 h-16 bg-[#c7e9c0] flex items-center justify-center mx-auto mb-4 rounded-lg hover:rotate-12 transition-transform duration-300">
              <Clock className="w-8 h-8 text-[#006d2c]" />
            </div>
            <div
              className={`text-3xl font-bold text-[#f7fcf5] mb-2 transition-all duration-500 ${
                statsVisible ? "animate-pulse" : "opacity-0"
              }`}
            >
              24/7
            </div>
            <div className="text-[#a1d99b] text-sm">Access</div>
          </div>
        </div>

        {/* Country Statistics */}
        <div
          ref={countryRef}
          className={`border border-[#c7e9c0] p-8 mb-20 rounded-lg hover:transform hover:scale-105 transition-all duration-500 delay-400 hover:shadow-2xl bg-[#238b45]/20 ${
            countryVisible
              ? "animate-fade-in-up animation-delay-800"
              : "opacity-0 translate-y-10"
          }`}
        >
          <h3
            className={`text-2xl font-bold text-[#f7fcf5] mb-8 text-center transition-all duration-500 delay-450 ${
              countryVisible
                ? "animate-fade-in-up animation-delay-900"
                : "opacity-0 translate-y-6"
            }`}
          >
            Leading Markets
          </h3>

          <div className="grid md:grid-cols-2 gap-6">
            {globalStats.map((stat, index) => (
              <div
                key={index}
                className={`bg-[#f7fcf5] text-[#006d2c] p-6 rounded-lg hover:transform hover:scale-105 transition-all duration-500 hover:shadow-lg hover:bg-[#e5f5e0] ${
                  countryVisible
                    ? `animate-fade-in-up animation-delay-${1000 + index * 100}`
                    : "opacity-0 translate-y-10"
                }`}
                style={{
                  transitionDelay: countryVisible
                    ? `${500 + index * 50}ms`
                    : "0ms",
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl hover:scale-125 transition-transform duration-300">
                      {stat.flag}
                    </span>
                    <div>
                      <div className="font-semibold">{stat.country}</div>
                      <div className="text-sm text-[#238b45]">Active Users</div>
                    </div>
                  </div>
                  <div
                    className={`text-xl font-bold transition-all duration-500 ${
                      countryVisible ? "animate-pulse" : "opacity-0"
                    }`}
                  >
                    {stat.users}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div
          ref={ctaRef}
          className={`text-center transition-all duration-500 delay-700 ${
            ctaVisible ? "" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="bg-[#f7fcf5] text-[#006d2c] p-12 rounded-lg hover:transform hover:scale-105 transition-all duration-500 hover:shadow-2xl">
            <h3
              className={`text-4xl font-bold mb-6 transition-all duration-500 delay-750 ${
                ctaVisible
                  ? "animate-fade-in-up animation-delay-1500"
                  : "opacity-0 translate-y-6"
              }`}
            >
              READY TO JOIN?
            </h3>
            <p
              className={`text-xl text-[#238b45] mb-8 max-w-2xl mx-auto transition-all duration-500 delay-800 ${
                ctaVisible
                  ? "animate-fade-in-up animation-delay-1600"
                  : "opacity-0 translate-y-6"
              }`}
            >
              Start securing your property rights today.
            </p>

            <div
              className={`flex flex-col sm:flex-row gap-4 justify-center transition-all duration-500 delay-850 ${
                ctaVisible
                  ? "animate-fade-in-up animation-delay-1700"
                  : "opacity-0 translate-y-6"
              }`}
            >
              <Button
                size="lg"
                className="bg-[#238b45] text-white hover:bg-[#006d2c] text-lg px-12 py-4 rounded-lg font-medium hover:scale-105 transition-all duration-300 hover:shadow-xl"
              >
                Get Started
              </Button>
              <Button
                size="lg"
                className="border-2 border-[#238b45] text-[#238b45] hover:bg-[#238b45] hover:text-white text-lg px-12 py-4 rounded-lg font-medium hover:scale-105 transition-all duration-300 hover:shadow-xl"
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GlobalReach;
