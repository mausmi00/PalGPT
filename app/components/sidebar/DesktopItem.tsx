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
      <div className="bg-gray-200 hover:text-black py-2 px-8 text-sm">
        {label}
      </div>
    )
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
            text-gray-500
            `,
          active && "bg-gray-100 text-black"
        )}
      >
        <Icon className="h-6 w-6 group-hover:hidden" />
        <div className="shrink-0 hidden text-gray-700 group-hover:block">
       {iconLabelDisplay()}
       </div>
        <span className="sr-only">{label}</span>
      </Link>{" "}
    </li>
  );
};

export default DesktopItem;
