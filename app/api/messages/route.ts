import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";
import { pusherServer } from "@/app/libs/pusher";
import getIsAiConversation from "@/app/actions/getIsAiConversation";
import getAiResponse from "@/app/actions/getAiResponse";
import setAiMemoryChain from "@/app/actions/setAiMemoryChain";

export async function POST(request: Request) {
    try {
        const currentUser = await getCurrentUser();
        const body = await request.json();

        const {
            message,
            image,
            conversationId
        } = body;

        const isAiConvo = await getIsAiConversation(conversationId);
        if (!currentUser?.id || !currentUser?.email) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const newMessage = await prisma.message.create({
            include: {
                seen: true,
                sender: true
            },
            data: {
                body: message,
                image: image,
                conversation: {
                    connect: {
                        id: conversationId
                    }
                },
                sender: {
                    connect: {
                        id: currentUser.id
                    }
                },
                seen: {
                    connect: {
                        id: currentUser.id
                    }
                }
            }
        });

        const updatedConversation = await prisma.conversation.update({
            where: {
                id: conversationId
            },
            data: {
                lastMessageAt: new Date(),
                messages: {
                    connect: {
                        id: newMessage.id
                    }
                }
            },
            include: {
                users: true,
                messages: {
                    include: {
                        seen: true
                    }
                }
            }
        });

        const getAllConvoUsers = await prisma.conversation.findUnique({
            where: {
                id: conversationId
            },
            include: {
                users: true
            }
        });

        await pusherServer.trigger(conversationId, 'messages:new', newMessage);

        const lastMessage = updatedConversation.messages[updatedConversation.messages.length - 1];
        let shouldTheResponderBeAnAi = false;

        if (isAiConvo) {
            await prisma.message.update({
                where: {
                    id: lastMessage.id
                },
                data: {
                    responderShouldBeAi: true
                }

            });
            shouldTheResponderBeAnAi = true;
        }

        updatedConversation.users.forEach((user) => {
            pusherServer.trigger(user.email!, "conversation:update", {
                id: conversationId,
                messages: [lastMessage]
            })
        });

        const getConversation = await prisma.conversation.findUnique({
            where: {
                id: conversationId
            },
            include: {
                users: true
            }
        });
        console.log(getConversation);
        let chain = null;
        if(getConversation?.isAiConvo == true && getConversation.messageIds.length == 0) {
            console.log("chain gets initialized");
            chain = await setAiMemoryChain();
        }

        if (isAiConvo && shouldTheResponderBeAnAi) {
            shouldTheResponderBeAnAi = false;
            let aiUser = null;
            getAllConvoUsers?.users.map((user) => {
                if (user.id != currentUser.id) {
                    aiUser = user.id;
                }
            })
            if (lastMessage.body != null && aiUser != null && chain != null) {
                const response = await getAiResponse(chain, lastMessage?.body);
                console.log("chain gets called");
                const newAiMessage = await prisma.message.create({
                    include: {
                        seen: true,
                        sender: true
                    },
                    data: {
                        body: response,
                        image: image,
                        conversation: {
                            connect: {
                                id: conversationId
                            }
                        },
                        sender: {
                            connect: {
                                id: aiUser
                            }
                        },
                        seen: {
                            connect: {
                                id: aiUser
                            }
                        }
                    }
                });
                await pusherServer.trigger(conversationId, 'messages:new', newAiMessage);

                return NextResponse.json(newAiMessage);

            }
        }

        return NextResponse.json(newMessage);

    } catch (error: any) {
        console.log(error, 'ERROR_MESSAGES');
        return new NextResponse('Internal Error', { status: 500 });
    }
}