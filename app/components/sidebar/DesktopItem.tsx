"use client";

import clsx from "clsx";
import Link from "next/link";

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
  function iconLabelDisplay() {
    return (
      <div className="bg-[#66FCF1] hover:text-[#1F2833] py-4 px-8 text-sm">
        {label}
      </div>
    );
  }

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
            bg-[#1F2833]
            opacity-100
            `,
           active && "bg-[#66FCF1] text-[#1F2833]"
        )}
      >
        <Icon className="h-6 w-6 group-hover:hidden group-hover:opacity-0" />
        <div className="hidden group-hover:block">
          {iconLabelDisplay()}
        </div>
        <span className="sr-only">{label}</span>
      </Link>{" "}
    </li>
  );
};

export default DesktopItem;
