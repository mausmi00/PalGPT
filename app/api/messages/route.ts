import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";
import { pusherServer } from "@/app/libs/pusher";
import getIsAiConversation from "@/app/actions/getIsAiConversation";
import getAiResponse from "@/app/actions/getAiResponse";
import setAiMemoryChain from "@/app/actions/setAiMemoryChain";
import { ConversationChain } from "langchain/chains";

// const express = require("express");
// const session = require("express-session");
// const cookieParser = require("cookie-parser")
// const app = express();

// // Initialization
// app.use(cookieParser());

// app.use(session({
//     secret: "maus",
//     saveUninitialized: true,
//     resave: true
// }));

// app.get('/', (req: { session: { view: number; }; }, res: { send: (arg0: string) => void; }) => {
//     if (req.session.view) {

//         // The next time when user visits,
//         // he is recognized by the cookie
//         // and variable gets updated.
//         req.session.view++;
//         console.log("count: ", req.session.view);
//         res.send("You visited this page for "
//             + req.session.view + " times");
//     }
//     else {

//         // If user visits the site for
//         // first time
//         req.session.view = 1;
//         res.send("You have visited this page"
//             + " for first time ! Welcome....");
//     }
// })

// // // Host
// // app.listen(3000, () =>
// //     console.log(`Server running at ${3000}`));

export async function POST(request: Request) {
    // const [chain, setChain] = useState<ConversationChain>();
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
            }
        });

        const getUpdatedConversationUsersAndMessages = await prisma.conversation.findUnique({
            where: {
                id: conversationId
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

        const lastMessage = getUpdatedConversationUsersAndMessages?.messages[getUpdatedConversationUsersAndMessages?.messages.length - 1];
        let shouldTheResponderBeAnAi = false;

        console.log("is ai convo? ", isAiConvo);
        if (isAiConvo) {
            await prisma.message.update({
                where: {
                    id: lastMessage?.id
                },
                data: {
                    responderShouldBeAi: true
                }

            });
            shouldTheResponderBeAnAi = true;
        }

        getUpdatedConversationUsersAndMessages?.users.forEach((user) => {
            pusherServer.trigger(user.email!, "conversation:update", {
                id: conversationId,
                messages: [lastMessage]
            })
        });

        //  console.log(updatedConversationUsersAndMessages);
        // let chain: ConversationChain;
        // let aiUser = null;
        // console.log("getUpdatedConversationUsersAndMessages: ", getUpdatedConversationUsersAndMessages?.isAiConvo);
        // //   console.log("getUpdatedConversationUsersAndMessages: ", getUpdatedConversationUsersAndMessages);
        // if (getUpdatedConversationUsersAndMessages?.isAiConvo == true && getUpdatedConversationUsersAndMessages.messages.length == 1) {
        //     console.log("chain gets initialized");
        //     // setChain(await setAiMemoryChain());
        //     chain = await setAiMemoryChain();

        //     getUpdatedConversationUsersAndMessages?.users.map((user) => {
        //         if (user.id != currentUser.id) {
        //             aiUser = user.id;
        //         }
        //     })
        //     if (aiUser != null) {
        //         await prisma.user.update({
        //             where: {
        //                 id: aiUser
        //             },
        //             data: {
        //                 chain: chain.toString()
        //             }
        //         })
        //     }
        // }

        console.log("shouldTheResponderBeAnAi: ", shouldTheResponderBeAnAi);
        if (isAiConvo && shouldTheResponderBeAnAi) {
            let aiUser = null;
            getUpdatedConversationUsersAndMessages?.users.map((user) => {
                if (user.id != currentUser.id) {
                    aiUser = user.id;
                }
            });
            // const userChain = await prisma.user.findUnique({
            //     where: {
            //         id: aiUser
            //     },
            //     include: {
            //         chain: true
            //     }
            // })

            shouldTheResponderBeAnAi = false;
            console.log("last messeabe: ", lastMessage?.body);
            console.log("ai user: ", aiUser);
            //console.log("chain: ", userChain?.chain);
            if (lastMessage?.body != null && aiUser != null) {
               // const response = await getAiResponse(chain, lastMessage?.body);
               await setAiMemoryChain.processInput(lastMessage?.body);
                // console.log("chain gets called");
                // console.log("responseeeee: ", response);
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