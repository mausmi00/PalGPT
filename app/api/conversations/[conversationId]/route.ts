import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";
import { pusherServer } from "@/app/libs/pusher";
import isAiUser from "@/app/actions/isAiUser";
import setAiMemoryChain from "@/app/actions/setAiMemoryChain";
import { Message } from "react-hook-form";
import { Conversation } from "@prisma/client";

interface IParams {
    conversationId: string
}

export async function DELETE(request: Request, { params }: { params: IParams }) {
    try {
        // console.log("conversation id");
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
                users: {
                    include: {
                        conversations: true,
                        seenMessages: true
                    }
                }
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
            }
        });



        if (deleteConversation) {

            existingConversation.users.forEach(async (user) => {
                const conversationsAfterDeletion = user.conversations.filter(conversation => conversationId != conversation.id);
                const conversationIdsAfterDeletion: string[] = [];
                conversationsAfterDeletion.forEach((conversation) => conversationIdsAfterDeletion.push(conversation.id))
                // console.log("convos now: ", conversationIdsAfterDeletion.length)
                const seenMessagesAfterDeletion = user.seenMessages.filter(message => message.conversationId != conversationId)
                const seenMessageIdsAfterDeletion: Message[] = [];
                seenMessagesAfterDeletion.forEach((message) => seenMessageIdsAfterDeletion.push(message.id));
                // console.log("messages now: ", seenMessagesAfterDeletion.length)
                // console.log("user name: ", user.name)
                const deleteCorrespondingConvoIdsFromUsers = await prisma.user.update({
                    where: {
                        id: user.id
                    },
                    data: {
                        conversationIds:
                        {
                            set: conversationIdsAfterDeletion
                        },
                        seenMessageIds: {
                            set: seenMessageIdsAfterDeletion
                        }
                    }

                });
            })
        }
        existingConversation.users.forEach((user) => {
            if (user.email) {
                pusherServer.trigger(user.email, 'conversation:remove', existingConversation);
            }
        });

        return NextResponse.json(deleteConversation);

    } catch (error: any) {
        // console.log(error, 'ERROR_CONVERSATION_DELETE');
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
                users: true,
                messages: true
            }
        })

        const potentialAiUser = currentConvo?.users.filter((user) => user.id != currentUser.id)
        // console.log("pote ai user:", potentialAiUser)
        // await pusherServer.trigger(currentUser?.id, "conversation:get", currentConvo?.messages);
        // const singleConversation = existingConversations[0];

        if (potentialAiUser != null) {
            // console.log("potential ai user")
            const isAiConvo = await isAiUser(potentialAiUser[0]?.id);
            // console.log("isAiCOnvo: ", isAiConvo);
            if (isAiConvo && potentialAiUser[0].name && potentialAiUser[0].characteristics) {
                //   console.log("should work");
                // console.log("call1")
                await setAiMemoryChain(potentialAiUser[0].name, potentialAiUser[0].characteristics, conversationId);
               // console.log("api/conv-id chain: ", global.CHAIN.prompt.promptMessages[0])
            }
        }
        return NextResponse.json(currentConvo);
    } catch (error: any) {
        console.log(error, 'ERROR_CONVERSATION_GET');
        return new NextResponse('Internal Error', { status: 500 });
    }

}