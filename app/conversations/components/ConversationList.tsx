"use client";

import useConversation from "@/app/hooks/useConversation";
import { FullConversationType } from "@/app/types";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { MdOutlineGroupAdd } from "react-icons/md";
import { GrRobot } from "react-icons/gr";
import ConversationBox from "./ConversationBox";
import GroupChatModal from "./GroupChatModal";
import { User } from "@prisma/client";
import { useSession } from "next-auth/react";
import { pusherClient } from "@/app/libs/pusher";
import { find } from "lodash";
import AiChatModal from "./AiChatModal";

interface ConversationListProps {
  initialItems: FullConversationType[];
  users: User[];
  ai_users: User[];
}

const ConversationList: React.FC<ConversationListProps> = ({
  initialItems,
  users,
  ai_users,
}) => {
  const session = useSession();
  const [items, setItems] = useState(initialItems);
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

  const router = useRouter();

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

    // to update the last message sent in conversation side bar
    const updateHandler = (newConversation: FullConversationType) => {
      let matchingConvo = null;
      setItems((current) =>
        current.map((currentConversation) => {
          if (currentConversation.id === newConversation?.id) {
            matchingConvo = currentConversation;
            matchingConvo = {
              ...matchingConvo,
              messages: matchingConvo.messages,
            };

            return {
              ...currentConversation,
              messages: newConversation.messages,
            };
          }
          return currentConversation;
        })
      );
      // to remove the conversation from the current position in conversation list and place it in the beginning
      if (matchingConvo != null) {
        const newItems = items.filter((conv) => conv.id !== newConversation.id);
        newItems.unshift(matchingConvo);
        setItems(newItems);
      }
    };

    const newHandler = (newConversation: FullConversationType) => {
      setItems((currentConversation) => {
        if (find(currentConversation, { id: newConversation.id })) {
          return currentConversation;
        }
        return [newConversation, ...currentConversation];
      });
    };

    // to remove the conversation from the list once deleted
    const removeHandler = (conversation: FullConversationType) => {
      setItems((current) => {
        return [...current.filter((convo) => convo.id !== conversation.id)];
      });

      // to redirect the user to conversations page once the current conversation is deleted
      if (conversation.id === conversationId) {
        router.push("/conversations");
      }
    };

    pusherClient.bind("conversation:new", newHandler);
    pusherClient.bind("conversation:update", updateHandler);
    pusherClient.bind("conversation:remove", removeHandler);

    // return () => {
    //   pusherClient.unsubscribe(pusherKey);
    //   pusherClient.unbind("conversation:new", newHandler);
    //   pusherClient.unbind("conversation:update", updateHandler);
    //   pusherClient.unbind("conversation:remove", removeHandler);
    // };
  }, [pusherKey, conversationId, router]);

  return (
    <>
      <AiChatModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
      />
      <GroupChatModal
        isOpen={isGroupModalOpen}
        onClose={() => setIsGroupModalOpen(false)}
        users={users}
      />

      <aside
        className={clsx(
          `
    fixed
    inset-y-0
    pb-20
    lg:pb-0
    lg:left-20
    lg:w-80
    lg:block
    overflow-y-auto scrollbar-thin scrollbar-thumb-[#C5C6C7] scrollbar-track-[#1F2833]
    border-r
    border-gray-200
    `,
          isOpen ? "hidden" : "block w-full left-0"
        )}
      >
        <div className="p-5">
          <div className="flex justify-between mb-4 pt-4">
            <div className="text-2xl font-bold text-white">Messages</div>
            {/* <div className=" flex flex-row"> */}
            <div
              onClick={() => setIsGroupModalOpen(true)}
              className="
              group
          rounded-full
          p-2
          bg-[#66FCF1]
          cursor-pointer
          hover:opactiy-75 
          transition
          "
            >
              <MdOutlineGroupAdd
                className="group-hover:hidden text-black"
                size={20}
              />
              <div className="hidden text-[#1F2833] group-hover:inline text-xs font-bold">
                Create group chat
              </div>
            </div>
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
          shrink-0
          text-white
          "
            >
              <GrRobot className="group-hover:hidden" size={20} />
              <div className=" hidden text-[#1F2833] group-hover:inline text-xs font-bold">
                Create agent
              </div>
            </div>
            {/* </div> */}
          </div>
          <hr className="w-auto h-1 my-4 border-0 rounded md:my-4 bg-[#66FCF1]" />
          {items.map((item) =>
            item != null ? (
              <ConversationBox
                key={item.id}
                data={item}
                selected={conversationId === item.id}
              />
            ) : (
              <div></div>
            )
          )}
        </div>
      </aside>
    </>
  );
};

export default ConversationList;
