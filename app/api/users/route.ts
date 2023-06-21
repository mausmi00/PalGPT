import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";
import { pusherServer } from "@/app/libs/pusher";


export async function POST(request: Request) {
    const currentUser = await getCurrentUser();

    if (!currentUser?.id || !currentUser?.email) {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await request.json();
    const {
        name,
        characteristics,
        image
    } = body;

    const user = await prisma?.user.create({
        data: {
            name,
            email: `${name.replace(/\s/g, "_")}@ai.com`,
            createdAt: new Date(),
            updatedAt: new Date(),
            isAi: true,
            image: image,
            characteristics: characteristics
        }
    });

  // pusherServer.trigger(currentUser.email, "user:new", user);


    const newConversation = await prisma.conversation.create({
        data: {
            users: {
                connect: [
                    {
                        id: currentUser.id
                    },
                    {
                        id: user.id
                    }
                ]

            },
            isAiConvo: true,
        },
        include: {
            users: true
        }
    });

    newConversation.users.map((user) => {
        if (user.email) {
            pusherServer.trigger(user.email, "conversation:new", newConversation);
        }
    });

    return NextResponse.json(user);
}



// name: 'Jeon Jungkook',
// email: "jeon_jungkook@ai.com",
// createdAt: new Date(),
// updatedAt: new Date(),
// image: "/images/jungkookk.jpg",
// isAi: true,
