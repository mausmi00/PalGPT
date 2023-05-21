import { useSession } from "next-auth/react";
import { FullConversationType } from "../types";
import { useMemo } from "react";

const useOtherUsers = (conversation: FullConversationType | { users: Users[] }) => {
    const session = useSession();

    const otherUsers = useMemo(() => {
        const currentUserEmail = session?.data?.user?.email;
        const otherUsers = conversation.users.filter((user) => user.email !== currentUserEmail);
        return otherUsers;
    }, [session?.data?.user?.email, conversation.users]);
}

export default useOtherUsers;