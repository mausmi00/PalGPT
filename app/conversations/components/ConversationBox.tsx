"use client";

import useOtherUsers from "@/app/hooks/useOtherUsers";
import { FullConversationType } from "@/app/types";
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
    const messages = data.messages;
    const lastMessage = messages[messages.length-1];

    return lastMessage;
  }, [data.messages]);
  return <div>Conversation box</div>;
};

export default ConversationBox;