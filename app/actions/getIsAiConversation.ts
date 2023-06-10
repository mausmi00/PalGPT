import getCurrentUser from "./getCurrentUser"
import prisma from "@/app/libs/prismadb";

const getIsAiConversation = async (conversationId: string) => {
    try {
        const currentUser = await getCurrentUser();

        if (!currentUser?.email) {
            return null
        }

        const conversationWithAi = await prisma.conversation.findUnique({
            where: {
                id: conversationId
            },
            include: {
                users: true
            }
        });

        if(conversationWithAi?.isAiConvo == true) {
            return true;
        }
        return false;
    } catch (error: any) {
        return false;
    }
}

export default getIsAiConversation;