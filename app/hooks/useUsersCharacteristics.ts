import { useSession } from "next-auth/react";
import { FullConversationType } from "../types";
import { useMemo } from "react";

const useUsersCharacteristics = (conversation: FullConversationType) => {
    const session = useSession();

    const usersCharacteristics = useMemo(() => {
        const currentUserEmail = session?.data?.user?.email;
        const otherUser = conversation.users.filter((user) => user.email !== currentUserEmail);
        const otherUserCharacteristics = otherUser[0].characteristics;
        return otherUserCharacteristics
    }, [session?.data?.user?.email, conversation.users]);
    return usersCharacteristics;
}

export default useUsersCharacteristics;