import React from "react";

interface HeaderSectionProps {
  title: string;
  subtitle: string;
}

const HeaderSection: React.FC<HeaderSectionProps> = ({ title, subtitle }) => {
  return (
    <div className="text-center mb-8">
      <h1
        className="text-5xl font-bold mb-4"
        style={{
          background:
            "linear-gradient(135deg, #465465 0%, #465465 50%, #293842 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
      >
        {title}
      </h1>
      <p className="text-xl" style={{ color: "#293842" }}>
        {subtitle}
      </p>
    </div>
  );
};

export default HeaderSection;
