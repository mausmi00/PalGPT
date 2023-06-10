import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";
import { pusherServer } from "@/app/libs/pusher";
import getIsAiConversation from "@/app/actions/getIsAiConversation";
import getAiResponse from "@/app/actions/getAiResponse";

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


        await pusherServer.trigger(conversationId, 'messages:new', newMessage);

        const lastMessage = updatedConversation.messages[updatedConversation.messages.length - 1];
        let shouldTheResponderBeAnAi = false;
        if (isAiConvo) {
            console.log("isAi: ", isAiConvo)
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

      //  const shouldTheResponderBeAnAi = lastMessage.responderShouldBeAi;
        if (isAiConvo && shouldTheResponderBeAnAi) {
            console.log("we are insideeee")
            //  console.log("here");
            if (lastMessage.body != null) {
                const response = await getAiResponse(lastMessage?.body);
                console.log("new Ai MEssageee!", response);
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
                return NextResponse.json(newAiMessage);



                //   axios.post("/api/messages", {
                //       response,
                //       conversationId: conversationId,
                //       //   });
                //   }
                //   )

            }
        }

        return NextResponse.json(newMessage);

    } catch (error: any) {
        console.log(error, 'ERROR_MESSAGES');
        return new NextResponse('Internal Error', { status: 500 });
    }
}