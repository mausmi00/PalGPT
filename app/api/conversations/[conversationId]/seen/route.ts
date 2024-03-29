import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";
import { pusherServer } from "@/app/libs/pusher";
import { Message, User } from "@prisma/client";
import getIsAiConversation from "@/app/actions/getIsAiConversation";

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
                users: true,
            }
        });

        if (!conversation) {
            return new NextResponse("Invalid ID", { status: 400 });
        }

        // Find last message
        const lastMessage = conversation.messages[conversation.messages.length - 1];
        let secondLastMessage: (Message & { seen: User[]; }) | null = null;
        if (conversation.messages.length >= 2) {
            secondLastMessage = conversation.messages[conversation.messages.length - 2];
        }
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

        conversation.users.forEach(async (user) => {
            // returns an array of seen ids of messages for a user
            const getSeenMessages = await prisma.user.findUnique({
                where: {
                    id: user.id
                },
                include: {
                    seenMessages: true
                }
            });

            // removes the previous last message of the conversation from the seenMessages list of the user
            // add the new last message to the seen message list of the user
            if (secondLastMessage != null) {
                const updatedSeenMessages = getSeenMessages?.seenMessageIds.filter((messageId) => messageId != secondLastMessage?.id)
                const updatedUserSeenMessages = await prisma.user.update({
                    where: {
                        id: user.id
                    },
                    include: {
                        seenMessages: true,
                    },
                    data: {
                        seenMessageIds: updatedSeenMessages
                    }
                });
            }

            if (user != null && user.email != null) {
                //updates the sidebar message (later)
                await pusherServer.trigger(user.email, "conversation:update", {
                    id: conversationId,
                    messages: [updatedMessage]
                });
            }
        });
        
        if (conversation.isAiConvo == false) {  
            await pusherServer.trigger(conversationId!, 'message:update', updatedMessage);
        }

        // if the current user has seen the message
        if (lastMessage.seenIds.indexOf(currentUser.id) !== -1) {
            return NextResponse.json(conversation);
        }

        return NextResponse.json(updatedMessage);

    } catch (error: any) {
        console.log(error, 'ERROR_MESSAGE_SEEN');
        return new NextResponse("Internal Error", { status: 500 });
    }
}