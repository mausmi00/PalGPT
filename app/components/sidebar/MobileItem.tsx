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
      <div className="bg-[#66FCF1] hover:text-[#1F2833] w-full py-4 px-8 text-sm">
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
    p-4`,
        active && "bg-[#66FCF1] text-black hover:bg-[#1F2833]"
      )}
    >
      <div>
      <Icon className="h-6 w-6 group-hover:hidden" />
      <div className="hidden group-hover:block">
       {iconLabelDisplay()}
       </div>
       </div>
    </Link>
  );
};

export default MobileItem;
