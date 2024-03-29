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
                },
                lastMessageOfTheContext: false
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
            }
        });

        const getUpdatedConversationUsersAndMessages = await prisma.conversation.findUnique({
            where: {
                id: conversationId
            },
            include: {
                users: true,
                messages: true
            }
        });

        await pusherServer.trigger(conversationId, 'messages:new', newMessage);

        const lastMessage = getUpdatedConversationUsersAndMessages?.messages[getUpdatedConversationUsersAndMessages?.messages.length - 1];
        let shouldTheResponderBeAnAi = false;

        let aiUserId = null;
        let aiUserName = null;
        let aiCharacteristics = null;
        if (isAiConvo) {
            await prisma.message.update({
                where: {
                    id: lastMessage?.id
                },
                data: {
                    responderShouldBeAi: true,
                    isAiConvoMessage: true
                }

            });
            shouldTheResponderBeAnAi = true;
            getUpdatedConversationUsersAndMessages?.users.map((user) => {
                if (user.id != currentUser.id) {
                    aiUserId = user.id;
                    aiUserName = user.name;
                    aiCharacteristics = user.characteristics
                }
            });
        }


        getUpdatedConversationUsersAndMessages?.users.forEach((user) => {
            pusherServer.trigger(user.email!, "conversation:update", {
                id: conversationId,
                messages: [lastMessage]
            })
        });

        // on agent creation, we need to set its prompt
        if (getUpdatedConversationUsersAndMessages?.isAiConvo == true && getUpdatedConversationUsersAndMessages.messages.length == 1 && aiUserName != null && aiCharacteristics != null) {
        //     console.log("chain gets initialized");
        //    console.log("call2");
            await setAiMemoryChain(aiUserName, aiCharacteristics, conversationId);
            // console.log("api/messages ", global.CHAIN.prompt.promptMessages[0]);
        }


        // console.log("shouldTheResponderBeAnAi: ", shouldTheResponderBeAnAi);
        // console.log("isAiConvo: ", isAiConvo);
        // console.log("aiUserId: ", aiUserId);
        if (isAiConvo && shouldTheResponderBeAnAi && aiUserId != null) {
            // console.log("insideeeee")
            let response: string = '';
            shouldTheResponderBeAnAi = false;
            // console.log("lastMessage body: ", lastMessage?.body)
            if (lastMessage?.body != null) {
                // console.log("ai useName: ", aiUserName)
                // console.log("achar: ", aiCharacteristics);
                if (global.CHAIN == null && aiUserName != null && aiCharacteristics != null) {
                    // console.log("call3")
                    // console.log("aiUserName: ", aiUserName)
                    // console.log("prompt: ", aiCharacteristics);
                    // console.log("conversationId: ", conversationId);
                    await setAiMemoryChain(aiUserName, aiCharacteristics, conversationId)
                        .then(async () => {
                            if (lastMessage?.body != null) {
                                try {
                                response = await getAiResponse(global.CHAIN, lastMessage?.body);
                                }
                                catch(error: any) {
                                    // console.log(error, 'ERROR_RESPONSEE');
                                    return new NextResponse('Internal Error', { status: 500 });
                                }
                            }

                        })
                  //  console.log("api messages2: ", (global as any).chain.prompt.promptMessages[0])
                }
                else {
                    // console.log("before getAiResponse");
                    // console.log("global.CHAIN: ", global.CHAIN)
                    try {
                    response = await getAiResponse(global.CHAIN, lastMessage?.body);
                    }
                    catch(error: any) {
                        // console.log(error, 'ERROR_RESPONSEE')
                        return new NextResponse('Internal Error', { status: 500 });
                    }
                    // console.log("response: ", response)

                }
                // console.log("chain before response: ", global.CHAIN.prompt.promptMessages[0]);
                // console.log("response: ", response);
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
                                id: aiUserId
                            }
                        },
                        seen: {
                            connect: {
                                id: aiUserId
                            }
                        },
                        isAiConvoMessage: true
                    }
                });
                // console.log("new message: ", newAiMessage)
                await pusherServer.trigger(conversationId, 'messages:new', newAiMessage);
                await pusherServer.trigger(currentUser.email!, "conversation:update", {
                    id: conversationId,
                    messages: [newAiMessage]
                });

                return NextResponse.json(newAiMessage);

            }
        }

        return NextResponse.json(newMessage);

    } catch (error: any) {
        console.log(error, 'ERROR_MESSAGES');
        return new NextResponse('Internal Error', { status: 500 });
    }
}