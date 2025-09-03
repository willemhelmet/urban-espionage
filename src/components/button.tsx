import { type ReactNode, type MouseEvent } from "react";

type ButtonVariant = "primary" | "secondary" | "small";

interface ButtonProps {
  children: ReactNode;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  href?: string;
  variant?: ButtonVariant;
  className?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

export default function Button({
  children,
  onClick,
  href,
  variant = "secondary",
  className = "",
  type = "button",
  disabled = false,
}: ButtonProps) {
  const baseClasses = "font-semibold text-center rounded-lg transition-all duration-200";
  
  const variantClasses = {
    primary: "block w-full py-4 px-6 bg-cyan-500 hover:bg-cyan-400 text-gray-900 text-lg transform hover:scale-105 shadow-lg",
    secondary: "block w-full py-4 px-6 bg-gray-700 hover:bg-gray-600 text-white text-lg transform hover:scale-105 shadow-lg",
    small: "bg-gray-700 hover:bg-gray-600 text-white px-4 py-2",
  };

  const disabledClasses = disabled 
    ? "opacity-50 cursor-not-allowed hover:scale-100" 
    : "";

  const finalClasses = `${baseClasses} ${variantClasses[variant]} ${disabledClasses} ${className}`;

  if (href) {
    return (
      <a href={href} className={finalClasses}>
        {children}
      </a>
    );
  }

  return (
    <button type={type} onClick={onClick} className={finalClasses} disabled={disabled}>
      {children}
    </button>
  );
}