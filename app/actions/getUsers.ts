import getSession from "./getSession";
import prisma from "@/app/libs/prismadb";

export default async function getUsers() {

    const session = await getSession();
    if (!session?.user?.email) {
        return []
    };

    try {
        const users = await prisma.user.findMany({
            orderBy: {
                createdAt: 'desc'
            },
            where: {
                isAi: false,
                AND: {
                    NOT: {
                        email: session?.user?.email,
                    },
                }
            }
        });

        const ai_users = await prisma.user.findMany({
            orderBy: {
                name: 'asc'
            },
            where: {
                isAi: true
            }
        });

        return [users, ai_users];
    } catch (errors: any) {
        return [];
    }

}