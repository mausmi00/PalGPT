"use client";

import { User } from "@prisma/client";
import UserBox from "./UserBox";
import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { pusherClient } from "@/app/libs/pusher";
import { find } from "lodash";
import GroupChatModal from "@/app/conversations/components/GroupChatModal";
import AiChatModal from "@/app/conversations/components/AiChatModal";
import clsx from "clsx";
import { GrRobot } from "react-icons/gr";
import useConversation from "@/app/hooks/useConversation";

interface UserListProps {
  initialItems: User[];
  ai_users: User[];
}

const UserList: React.FC<UserListProps> = ({ initialItems, ai_users }) => {
  const session = useSession();
  const [items, setItems] = useState(initialItems);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const { conversationId, isOpen } = useConversation();

  const pusherKey = useMemo(() => {
    return session.data?.user?.email;
  }, [session.data?.user?.email]);

  useEffect(() => {
    // if the session has not loaded yet
    if (!pusherKey) {
      return;
    }

    pusherClient.subscribe(pusherKey);

    const newHandler = (newPeople: User) => {
      setItems((currentPeople) => {
        if (find(currentPeople, { id: newPeople.id })) {
          return currentPeople;
        }
        return [newPeople, ...currentPeople];
      });
    };

    pusherClient.bind("user:new", newHandler);

    return () => {
      pusherClient.unsubscribe(pusherKey);
      pusherClient.unbind("user:new", newHandler);
    };
  }, [pusherKey]);
  return (
    <>
      <AiChatModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
      />
      <aside
        className={clsx(
          `fixed
        inset-y-0
        pb-20
        lb:pb-0
        lg:left-20
        lg:w-80
        lg:block
        overflow-y-auto scrollbar-thin scrollbar-thumb-[#C5C6C7] scrollbar-track-[#1F2833] rounded-[12px]
        border-r
        border-gray-200
        block
        w-full
        left-0`,
          isOpen ? "hidden" : "block w-full left-0"
        )}
      >
        <div className="px-5">
          <div
            className="
                text-2xl
                font-bold
                py-4"
          >
            <div className="flex justify-between mb-4 pt-4">
              Agents
              <div
                onClick={() => setIsAiModalOpen(true)}
                className="
              group
          rounded-full
          p-2
          bg-[#66FCF1]
          cursor-pointer
          hover:opactiy-75 
          transition
          text-white
          text-center
          "
              >
                {/* <GrRobot className="mt-2" size={20} /> */}
                <div className=" text-[#1F2833] text-xs font-bold">
                  Create an agent
                </div>
              </div>
            </div>
            <hr className="w-auto h-1 my-4 border-0 rounded md:my-4 bg-[#66FCF1]" />
          </div>
          {ai_users.map((user) => (
            <UserBox key={user.id} user={user} />
          ))}
        </div>
      </aside>
    </>
  );
};

export default UserList;
