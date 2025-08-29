import { Button } from "@/components/ui/button";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const PlatformOverview = () => {
  const { elementRef: headerRef, isVisible: headerVisible } =
    useScrollAnimation<HTMLDivElement>();
  const { elementRef: buttonRef, isVisible: buttonVisible } =
    useScrollAnimation<HTMLDivElement>();
  const { elementRef: cardsRef, isVisible: cardsVisible } =
    useScrollAnimation<HTMLDivElement>();

  return (
    <section className="py-32 bg-white">
      <div className="max-w-4xl mx-auto px-4">
        {/* Main Heading */}
        <div ref={headerRef} className="text-center mb-20">
          <h2
            className={`text-6xl lg:text-7xl font-bold text-black mb-8 transition-all duration-500 ${
              headerVisible ? "animate-fade-in-up" : "opacity-0 translate-y-10"
            }`}
          >
            LAND OWNERSHIP.{" "}
            <span
              className={`text-black transition-all duration-500 delay-100 ${
                headerVisible
                  ? "animate-fade-in-up animation-delay-200"
                  : "opacity-0 translate-y-10"
              }`}
            >
              REVOLUTIONIZED.
            </span>
          </h2>
          <p
            className={`text-xl text-gray-600 max-w-2xl mx-auto transition-all duration-500 delay-200 ${
              headerVisible
                ? "animate-fade-in-up animation-delay-400"
                : "opacity-0 translate-y-10"
            }`}
          >
            Blockchain-powered. Globally accessible. Instantly verified.
          </p>
        </div>

        {/* Action Button */}
        <div ref={buttonRef} className="text-center mb-24">
          <Button
            size="lg"
            className={`bg-[#238b45] text-white hover:bg-[#006d2c] text-lg px-16 py-6 rounded-lg font-medium hover:scale-105 transition-all duration-500 ${
              buttonVisible
                ? "animate-fade-in-up animation-delay-600"
                : "opacity-0 translate-y-10"
            }`}
          >
            Start Now
          </Button>
        </div>

        {/* Feature Cards */}
        <div
          ref={cardsRef}
          className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto"
        >
          {/* Blockchain Security Card */}
          <div
            className={`relative transition-all duration-500 delay-100 ${
              cardsVisible
                ? "animate-fade-in-up animation-delay-800"
                : "opacity-0 translate-y-10"
            }`}
          >
            <div className="bg-[#238b45] text-white p-8 h-72 rounded-lg hover:transform hover:scale-105 transition-all duration-500 hover:shadow-2xl">
              <div
                className={`text-sm text-[#c7e9c0] mb-4 transition-all duration-500 delay-150 ${
                  cardsVisible
                    ? "animate-slide-in-left animation-delay-1000"
                    : "opacity-0 -translate-x-4"
                }`}
              >
                Security
              </div>
              <div
                className={`text-4xl font-bold mb-6 transition-all duration-500 delay-200 ${
                  cardsVisible
                    ? "animate-bounce-in animation-delay-1200"
                    : "opacity-0 scale-75"
                }`}
              >
                100%
              </div>
              <div
                className={`text-lg font-medium mb-8 transition-all duration-500 delay-250 ${
                  cardsVisible
                    ? "animate-slide-in-left animation-delay-1400"
                    : "opacity-0 -translate-x-4"
                }`}
              >
                Immutable
              </div>
              <div
                className={`border border-[#c7e9c0] px-6 py-3 inline-block rounded-lg hover:bg-[#c7e9c0] hover:text-[#238b45] transition-all duration-500 delay-300 ${
                  cardsVisible
                    ? "animate-fade-in animation-delay-1600"
                    : "opacity-0"
                }`}
              >
                <span className="text-sm font-medium">Blockchain</span>
              </div>
            </div>
          </div>

          {/* Smart Contracts Card */}
          <div
            className={`relative transition-all duration-500 delay-200 ${
              cardsVisible
                ? "animate-fade-in-up animation-delay-1000"
                : "opacity-0 translate-y-10"
            }`}
          >
            <div className="bg-white border-2 border-[#41ab5d] text-black p-8 h-72 rounded-lg hover:transform hover:scale-105 transition-all duration-500 hover:shadow-2xl">
              <div
                className={`text-sm text-[#41ab5d] mb-4 transition-all duration-500 delay-250 ${
                  cardsVisible
                    ? "animate-slide-in-left animation-delay-1200"
                    : "opacity-0 -translate-x-4"
                }`}
              >
                Automation
              </div>
              <div
                className={`text-4xl font-bold mb-6 transition-all duration-500 delay-300 ${
                  cardsVisible
                    ? "animate-bounce-in animation-delay-1400"
                    : "opacity-0 scale-75"
                }`}
              >
                INSTANT
              </div>
              <div
                className={`text-lg font-medium mb-8 transition-all duration-500 delay-350 ${
                  cardsVisible
                    ? "animate-slide-in-left animation-delay-1600"
                    : "opacity-0 -translate-x-4"
                }`}
              >
                Verification
              </div>
              <div
                className={`border border-[#41ab5d] px-6 py-3 inline-block rounded-lg hover:bg-[#41ab5d] hover:text-white transition-all duration-500 delay-400 ${
                  cardsVisible
                    ? "animate-fade-in animation-delay-1800"
                    : "opacity-0"
                }`}
              >
                <span className="text-sm font-medium">Smart Contract</span>
              </div>
            </div>
          </div>

          {/* Global Access Card */}
          <div
            className={`relative transition-all duration-500 delay-300 ${
              cardsVisible
                ? "animate-fade-in-up animation-delay-1200"
                : "opacity-0 translate-y-10"
            }`}
          >
            <div className="bg-[#f7fcf5] border border-[#e5f5e0] text-black p-8 h-72 rounded-lg hover:transform hover:scale-105 transition-all duration-500 hover:shadow-2xl">
              <div
                className={`text-sm text-[#41ab5d] mb-4 transition-all duration-500 delay-350 ${
                  cardsVisible
                    ? "animate-slide-in-left animation-delay-1400"
                    : "opacity-0 -translate-x-4"
                }`}
              >
                Access
              </div>
              <div
                className={`text-4xl font-bold mb-6 transition-all duration-500 delay-400 ${
                  cardsVisible
                    ? "animate-bounce-in animation-delay-1600"
                    : "opacity-0 scale-75"
                }`}
              >
                24/7
              </div>
              <div
                className={`text-lg font-medium mb-8 transition-all duration-500 delay-450 ${
                  cardsVisible
                    ? "animate-slide-in-left animation-delay-1800"
                    : "opacity-0 -translate-x-4"
                }`}
              >
                Global
              </div>
              <div
                className={`border border-[#74c476] px-6 py-3 inline-block rounded-lg hover:bg-[#74c476] hover:text-white transition-all duration-500 delay-500 ${
                  cardsVisible
                    ? "animate-fade-in animation-delay-2000"
                    : "opacity-0"
                }`}
              >
                <span className="text-sm font-medium">Worldwide</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PlatformOverview;
