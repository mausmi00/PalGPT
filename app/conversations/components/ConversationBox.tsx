"use client";

import Avatar from "@/app/components/Avatar";
import AvatarGroup from "@/app/components/AvatarGroup";
import LoadingModal from "@/app/components/LoadingModal";
import useOtherUsers from "@/app/hooks/useOtherUsers";
import { FullConversationType } from "@/app/types";
import axios from "axios";
import clsx from "clsx";
import { format } from "date-fns";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import toast from "react-hot-toast";

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

  const [isLoading, setIsLoading] = useState(false);

  const handleClick = useCallback(() => {
    setIsLoading(true);
    axios
      .get(`/api/conversations/${data.id}`)
      .then(() => {
          router.push(`/conversations/${data.id}`);
      })
      .catch(() => toast.error("Something went wrong!"))
      .finally(() => setIsLoading(false));
    // console.log("called");
  }, [data, router]);

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

    const seenArray = lastMessage.seen || [];

    if (!userEmail) {
      return false;
    }

    return seenArray.filter((user) => user.email === userEmail).length !== 0;
  }, [userEmail, lastMessage]);

  const lastMessageText = useMemo(() => {
    if (lastMessage?.image) {
      return "Sent an image";
    }

    if (lastMessage?.body) {
      return lastMessage?.body;
    } else {
      return "Started a conversation";
    }
  }, [lastMessage]);

  return (
    <>
      {isLoading && <LoadingModal />}
      <div
        onClick={handleClick}
        className={clsx(
          `
    w-full
    relative
    flex
    items-center
    space-x-3
    p-3
    opacity-100
    hover:text-[#1F2833]
    hover:bg-[#66FCF1]
    hover:opacity-100
    rounded-lg
    transition
    cursor-pointer
    `,
          selected ? "bg-[#66FCF1] text-[#1F2833]" : "bg-[#1F2833] text-white"
        )}
      >
        {data.isGroup ? (
          <AvatarGroup users={data.users} />
        ) : (
          <Avatar user={otherUsers} />
        )}

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
            "
              >
                {data.name || otherUsers?.name}
              </p>

              {lastMessage?.createdAt && (
                <p
                  className="
              text-xs
              font-light
              "
                >
                  {format(new Date(lastMessage.createdAt), "p")}
                </p>
              )}
            </div>
            <p
              className={clsx(
                `
          truncate
          text-sm
          `,
                hasSeen ? "font-small" : " font-bold"
              )}
            >
              {lastMessageText}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConversationBox;
