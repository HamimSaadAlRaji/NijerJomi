import React from "react";

interface HeaderSectionProps {
  title: string;
  subtitle: string;
}

const HeaderSection: React.FC<HeaderSectionProps> = ({ title, subtitle }) => {
  return (
    <div className="text-center mb-8">
      <h1 className="text-5xl font-bold text-black mb-4">{title}</h1>
      <p className="text-xl text-gray-600">{subtitle}</p>
    </div>
  );
};

export default HeaderSection;
