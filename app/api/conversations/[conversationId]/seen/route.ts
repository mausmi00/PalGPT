import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";
import { pusherServer } from "@/app/libs/pusher";

interface IParams {
    conversationId: string
}

export async function POST(
    request: Request,
    { params }: { params: IParams }
) {
    try {
        const { conversationId } = params;
        const currentUser = await getCurrentUser();
        
        if (!currentUser?.id || !currentUser?.email) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        // Find existing conversation
        const conversation = await prisma?.conversation.findUnique({
            where: {
                id: conversationId
            },
            include: {
                messages: {
                    include: {
                        seen: true
                    }
                },
                users: true
            }
        });

        if (!conversation) {
            return new NextResponse("Invalid ID", { status: 400 });
        }

        // Find last message
        const lastMessage = conversation.messages[conversation.messages.length - 1];
        if (!lastMessage) {
            return NextResponse.json(conversation);
        }

        // Update seen of last message
        const updatedMessage = await prisma.message.update({
            where: {
                id: lastMessage.id
            },
            include: {
                sender: true,
                seen: true
            },
            data: {
                seen: {
                    connect: {
                        id: currentUser.id
                    }
                }
            }
        });

        //updates the sidebar message (later)
        await pusherServer.trigger(currentUser.email, "conversation:update", {
            id: conversationId,
            messages: [updatedMessage]
        });

        // if the current user has seen the message
        if (lastMessage.seenIds.indexOf(currentUser.id) !== -1) {
            return NextResponse.json(conversation);
        }

        await pusherServer.trigger(conversationId!, 'messages:update', updatedMessage);

        return NextResponse.json(updatedMessage);

    } catch (error: any) {
        console.log(error, 'ERROR_MESSAGE_SEEN');
        return new NextResponse("Internal Error", { status: 500 });
    }
}