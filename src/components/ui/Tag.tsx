import React from "react";
import { cn } from "@/lib/utils";

type TagColor =
  | "green"
  | "blue"
  | "red"
  | "gray"
  | "yellow"
  | "purple"
  | "indigo";

interface TagProps {
  children: React.ReactNode;
  color?: TagColor;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const Tag: React.FC<TagProps> = ({
  children,
  color = "gray",
  size = "md",
  className,
}) => {
  const colorClasses = {
    green: "bg-green-100 text-green-800 border-green-200",
    blue: "bg-blue-100 text-blue-800 border-blue-200",
    red: "bg-red-100 text-red-800 border-red-200",
    gray: "bg-gray-100 text-gray-800 border-gray-200",
    yellow: "bg-yellow-100 text-yellow-800 border-yellow-200",
    purple: "bg-purple-100 text-purple-800 border-purple-200",
    indigo: "bg-indigo-100 text-indigo-800 border-indigo-200",
  };

  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-1 text-sm",
    lg: "px-3 py-1.5 text-base",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md font-medium border",
        colorClasses[color],
        sizeClasses[size],
        className
      )}
    >
      {children}
    </span>
  );
};

export default Tag;
