import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
}

const variantClasses: Record<string, string> = {
  primary: "bg-accent-gold text-navy-950 hover:brightness-95 active:brightness-90",
  secondary: "bg-white/10 text-white border border-white/15 hover:bg-white/15",
  ghost: "bg-transparent text-silver-100 hover:bg-white/5",
  danger: "bg-accent-red text-white hover:brightness-95",
};

const sizeClasses: Record<string, string> = {
  sm: "text-xs px-3 py-1.5 rounded-lg",
  md: "text-sm px-4 py-2.5 rounded-xl",
  lg: "text-base px-5 py-3.5 rounded-2xl",
};

export function Button({ variant = "primary", size = "md", className = "", ...props }: ButtonProps) {
  return (
    <button
      className={`font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    />
  );
}
