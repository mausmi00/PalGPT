"use client";

import clsx from "clsx";

interface ButtonProps {
  type?: "button" | "submit" | "reset" | undefined;
  fullWidth?: boolean;
  children?: React.ReactNode;
  onClick?: () => void;
  secondary?: boolean;
  danger?: boolean;
  disabled?: boolean;
  color?:string;
  gradient?: boolean;
  description?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  type,
  fullWidth,
  children,
  onClick,
  secondary,
  danger,
  disabled,
  color,
  gradient,
  description
}) => {
  return (
    <button
      onClick={onClick}
      type={type}
      disabled={disabled}
      className={clsx(
        `
        flex
        justify-center
        rounded-md
        px-3
        py-2
        text-sm
        font-semibold
        focus-visible:outline
        focus-visible:outline-2
        focus-visible:outline-offset-2
       ` /*dynamic classes after ` */,
      color,
       disabled && "opacity-50 cursor-default",
        fullWidth && "w-full",
        secondary ? "bg-[#66FCF1] text-[#1F2833] hover:bg-[#C5C6C7]" : "text-[#1F2833]",
        danger &&
          "bg-rose-500 hover:bg-rose-600 focus-visible:outline-rose-600",       
        !secondary &&
          !danger &&
          "bg-[#66FCF1] hover:bg-[#C5C6C7] focus-visible:outline-key-600",
          description && "bg-gradient-to-r from-[#1F2833] to-[#1F2833] text-white text-md text-left px-0",
          gradient && " bg-gradient-to-r from-[#66FCF1] to-white "          
      )}
    >
      {children}
    </button>
  );
};

export default Button;
