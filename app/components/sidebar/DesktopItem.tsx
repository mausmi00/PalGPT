"use client";

import clsx from "clsx";
import Link from "next/link";
import { useState } from "react";

interface DesktopItemProps {
  label: string;
  icon: any;
  href: string;
  onClick?: () => void;
  active?: boolean;
}

const DesktopItem: React.FC<DesktopItemProps> = ({
  label,
  icon: Icon,
  href,
  onClick,
  active,
}) => {
  const handleClick = () => {
    if (onClick) {
      return onClick();
    }
  };

  return (
    <li onClick={handleClick}>
      <Link
        href={href}
        className={clsx(
          `
            group
            flex
            rounded-md
            p-3
            text-sm
            leading-6
            font-semibold
            opacity-100
            `,
          active && "bg-[#66FCF1] text-[#1F2833]"
        )}
      >
        <Icon className="h-6 w-6 group-hover:hidden" />
        <div className={clsx( `hidden bg-[#66FCF1] text-[#1F2833] group-hover:inline text-xs font-bold`,
        active ? "py-1" : "py-3 px-2 rounded-md leading-6")}
        >
          {label}
        </div>
        <span className="sr-only">{label}</span>
      </Link>{" "}
    </li>
  );
};

export default DesktopItem;
