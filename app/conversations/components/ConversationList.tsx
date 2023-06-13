"use client";

import useConversation from "@/app/hooks/useConversation";
import { FullConversationType } from "@/app/types";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { MdOutlineGroupAdd } from "react-icons/md";
import ConversationBox from "./ConversationBox";
import GroupChatModal from "./GroupChatModal";
import { User } from "@prisma/client";
import { useSession } from "next-auth/react";
import { pusherClient } from "@/app/libs/pusher";
import { find } from "lodash";
import getIsAiConversation from "@/app/actions/getIsAiConversation";
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
  const [isModalOpen, setIsModalOpen] = useState(false);

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
      setItems((current) =>
        current.map((currentConversation) => {
          if (currentConversation.id === newConversation.id) {
            // console.log("messagesss: ", newConversation.messages)
            return {
              ...currentConversation,
              messages: newConversation.messages,
            };
          }
          return currentConversation;
        })
      );
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

    return () => {
      pusherClient.unsubscribe(pusherKey);
      pusherClient.unbind("conversation:new", newHandler);
      pusherClient.unbind("conversation:update", updateHandler);
      pusherClient.unbind("conversation:remove", removeHandler);
    };
  }, [pusherKey, conversationId, router]);

  return (
    <>
      <AiChatModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
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
    overflow-y-auto
    border-r
    border-gray-200
    `,
          isOpen ? "hidden" : "block w-full left-0"
        )}
      >
        <div className="px-5">
          <div className="flex justify-between mb-4 pt-4">
            <div className="text-2xl font-bold text-neutral-800">Messages</div>
            <div
              onClick={() => setIsModalOpen(true)}
              className="
          rounded-full
          p-2
          bg-gray-100
          test-gray-600
          cursor-pointer
          hover:opactiy-75 
          transition"
            >
              <MdOutlineGroupAdd size={20} />
            </div>
          </div>
          {items.map((item) => (
            <ConversationBox
              key={item.id}
              data={item}
              selected={conversationId === item.id}
            />
          ))}
        </div>
      </aside>
    </>
  );
};

export default ConversationList;
