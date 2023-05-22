"use client";

import Avatar from "@/app/components/Avatar";
import useOtherUsers from "@/app/hooks/useOtherUsers";
import { FullConversationType } from "@/app/types";
import clsx from "clsx";
import { format } from "date-fns";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useCallback, useMemo } from "react";

interface ConversationBoxProps {
  data: FullConversationType;
  selected?: boolean;
}

const ConversationBox: React.FC<ConversationBoxProps> = ({
  data,
  selected,
}) => {
  const otherUsers = useOtherUsers(data);
  const session = useSession();
  const router = useRouter();

  const handleClick = useCallback(() => {
    router.push(`/conversations/${data.id}`);
  }, [data.id, router]);

  const lastMessage = useMemo(() => {
    const messages = data.messages || [];
    const lastMessage = messages[messages.length - 1];

    return lastMessage;
  }, [data.messages]);

  const userEmail = useMemo(() => {
    return session.data?.user?.email;
  }, [session.data?.user?.email]);

  const hasSeen = useMemo(() => {
    if (!lastMessage) {
      return false;
    }

    if (!userEmail) {
      return false;
    }

    const seenArray = lastMessage.seen || [];
    return seenArray.filter((user) => user.email === userEmail).length !== 0;
  }, [userEmail, lastMessage]);

  const lastMessageText = useMemo(() => {
    if (lastMessage?.image) {
      return "Sent an image";
    }

    if (lastMessage?.body) {
      return lastMessage.body;
    }

    return "Started a conversation";
  }, [lastMessage]);

  return (
    <div
      onClick={handleClick}
      className={clsx(
        `
    w-full
    relative
    flex
    items-center
    space-x-3
    hover:bg-netural-100
    rounded-lg
    transition
    cursor-pointer
    `,
        selected ? "bg-neutral-100" : "bg-white"
      )}
    >
      <Avatar user={otherUsers} />
      <div className="min-w-0 flex-1">
        <div className="focus:outline-none">
          <div
            className="
          flex
          justify-between
          items-center
          mb-1"
          >
            <p
              className="
            text-md 
            font-medium
            text-gray-900
            "
            >
              {data.name || otherUsers.name}
            </p>
            {lastMessage?.createdAt && (
              <p
                className="
              text-xs
              text-gray-400
              font-light"
              >
                {format(new Date(lastMessage.createdAt), "p")}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConversationBox;
