import { useSession } from "next-auth/react";
import { FullConversationType } from "../types";
import { useMemo } from "react";
import { User } from "@prisma/client";

// returns other users of a conversation
const useConversationAgent = (conversation: FullConversationType) => {
    // const session = useSession();

    
        // const currentUserEmail = session?.data?.user?.email;
        // const otherUsers = conversation.users.filter((user) => user.email !== currentUserEmail);
        const agents = conversation.users.filter((user) => user.isAi)
        return agents;
}

export default useConversationAgent;