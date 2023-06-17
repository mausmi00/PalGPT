"use client";

import clsx from "clsx";
import Link from "next/link";

interface MobileItemProps {
  href: string;
  active?: boolean;
  icon: any;
  onClick?: () => void;
  label:string
}

const MobileItem: React.FC<MobileItemProps> = ({
  href,
  active,
  icon: Icon,
  onClick,
  label
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
    <Link
      onClick={onClick}
      href={href}
      className={clsx(
        `
    group
    flex
    gap-x-3
    text-sm
    leading-6
    font-semibold
    w-full
    justify-center
    p-4
    text-gray-500`,
        active && "bg-gray-100 text-black"
      )}
    >
      <Icon className="h-6 w-6 shrink-0" />
      <div className="shrink-0 hidden text-gray-700 group-hover:block">
       {iconLabelDisplay()}
       </div>
    </Link>
  );
};

export default MobileItem;
