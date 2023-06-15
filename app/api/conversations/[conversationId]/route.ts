import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";
import { pusherServer } from "@/app/libs/pusher";
import isAiUser from "@/app/actions/isAiUser";
import setAiMemoryChain from "@/app/actions/setAiMemoryChain";

interface IParams {
    conversationId: string
}

export async function DELETE(request: Request, { params }: { params: IParams }) {
    try {
        console.log("conversation id");
        const { conversationId } = params;
        const currentUser = await getCurrentUser();

        if (!currentUser?.id) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const existingConversation = await prisma.conversation.findUnique({
            where: {
                id: conversationId
            },
            include: {
                users: true
            }
        });

        if (!existingConversation) {
            return new NextResponse('Invalid ID', { status: 400 })
        }

        const deleteConversation = await prisma.conversation.deleteMany({
            where: {
                id: conversationId,
                userIds: {
                    hasSome: [currentUser.id]
                },
            },
        });

        existingConversation.users.forEach((user) => {
            if (user.email) {
                pusherServer.trigger(user.email, 'conversation:remove', existingConversation);
            }
        });

        return NextResponse.json(deleteConversation);

    } catch (error: any) {
        console.log(error, 'ERROR_CONVERSATION_DELETE');
        return new NextResponse('Internal Error', { status: 500 });
    }

}

export async function GET(request: Request, { params }: { params: IParams }) {
    const { conversationId } = params;
    const currentUser = await getCurrentUser();
    if (!currentUser?.id) {
        return new NextResponse('Unauthorized', { status: 401 });
    }
    try {
        const currentConvo = await prisma.conversation.findUnique({
            where: {
                id: conversationId
            },
            include: {
                users: true
            }
        })

        const potentialAiUser = currentConvo?.users.filter((user) => user.id != currentUser.id)


        // const singleConversation = existingConversations[0];

        if (potentialAiUser != null) {
            const isAiConvo = await isAiUser(potentialAiUser[0]?.id);
            if (isAiConvo && potentialAiUser[0].name && potentialAiUser[0].characteristics) {
              //  console.log("should work")
                 await setAiMemoryChain(potentialAiUser[0].name, potentialAiUser[0].characteristics);
            }
        }
        return NextResponse.json(currentConvo);
    } catch (error: any) {
        console.log(error, 'ERROR_CONVERSATION_DELETE');
        return new NextResponse('Internal Error', { status: 500 });
    }


}