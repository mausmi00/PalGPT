"use client";

import Avatar from "@/app/components/Avatar";
import useOtherUsers from "@/app/hooks/useOtherUsers";
import { Conversation, User } from "@prisma/client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { HiChevronLeft, HiEllipsisHorizontal } from "react-icons/hi2";
import ProfileDrawer from "./ProfileDrawer";
import AvatarGroup from "@/app/components/AvatarGroup";
import useActiveList from "@/app/hooks/useActiveList";
import Button from "@/app/components/Buttons";
import { useRouter } from "next/navigation";

interface HeaderProps {
  conversation: Conversation & {
    users: User[];
  };
}

const Header: React.FC<HeaderProps> = ({ conversation }) => {
  const router = useRouter();
  router.refresh();
  const otherUsers = useOtherUsers(conversation);
  const [isOpen, setIsOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { members } = useActiveList();
  let isActive = members.indexOf(otherUsers?.email!) !== -1;

  if (otherUsers?.isAi == true) {
    isActive = true;
  }

  const onClickCharacteristics = () => {
    // console.log("clicked")
    // return (
    //   <div>
    //     <p>{otherUsers?.characteristics}</p>
    //   </div>
    // );
    if (otherUsers.isAi) {
      setIsOpen(!isOpen);
    }
  };

  const statusText = useMemo(() => {
    if (conversation.isGroup) {
      return `${conversation.users.length} members`;
    }
    return isActive ? "Active" : "Offline";
  }, [conversation, isActive]);

  return (
    <>
      <ProfileDrawer
        data={conversation}
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
      <div
        className="
    bg-[#1F2833]
    w-full
    flex
    border-b-[1px]
    sm:px-4
    py-3
    px-4
    lg:px-6
    justify-between
    items-center
    shadow-sm
    "
      >
        <div className="flex gap-3 items-center">
          <Link
            className="
            lg:hidden
            block
            text-white
            hover:text-[#66FCF1]
            transition
            cursor-pointer"
            href="/conversations"
          >
            <HiChevronLeft size={32} />
          </Link>
          {conversation.isGroup ? (
            <AvatarGroup users={conversation.users} />
          ) : (
            <Avatar user={otherUsers} />
          )}

          <div
            className="
        flex flex-col"
          >
            <div className="bg-[#1F2833] text-white">
              <Button
                onClick={onClickCharacteristics}
                description
                type="button"
              >
                {conversation.name || otherUsers.name}
              </Button>
              {isOpen ? (
                <p className="text-sm px-3">{otherUsers?.characteristics}</p>
              ) : null}
            </div>
            {/* <p className="text-sm">{otherUsers?.characteristics}</p> */}
            <div
              className="text-sm
          font-light
          text-neutral-500
          px-3"
            >
              {statusText}
            </div>
          </div>
        </div>
        <HiEllipsisHorizontal
          size={32}
          onClick={() => {
            setDrawerOpen(true);
          }}
          className="
      text-sky-500
      hover:text-sky-600
      cursor-pointer
      transition"
        />
      </div>
    </>
  );
};

export default Header;
