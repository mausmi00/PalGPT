import { useSession } from "next-auth/react";
import { FullConversationType } from "../types";
import { useMemo } from "react";
import { Conversation, User } from "@prisma/client";

// returns other users of a conversation
const useOtherUsers = (conversation: Conversation & {
    users: User[]
}) => {
    const session = useSession();

    const otherUsers = useMemo(() => {
        const currentUserEmail = session?.data?.user?.email;
        const otherUsers = conversation.users.filter((user) => user.email !== currentUserEmail);
        return otherUsers[0];
    }, [session?.data?.user?.email, conversation.users]);
    return otherUsers;
}

export default useOtherUsers;