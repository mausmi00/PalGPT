import { FullConversationType } from "../types";
import getCurrentUser from "./getCurrentUser"
import prisma from "@/app/libs/prismadb";

const getConversationAiUser = async (conversationId: string) => {
    try {
        const currentUser = await getCurrentUser();

        if (!currentUser?.email) {
            return null
        }

        const conversation = await prisma.conversation.findUnique({
            where: {
                id: conversationId
            },
            include: {
                users: true
            }
        });

        const aiUser = conversation?.users.filter((user) => user.id != currentUser.id)

        return aiUser;
    } catch (error: any) {
        return null;
    }
}

export default getConversationAiUser;