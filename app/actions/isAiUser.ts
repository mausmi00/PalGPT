import getSession from "./getSession";
import prisma from "@/app/libs/prismadb";


const isAiUser = async (userId: string) => {
    console.log("user id is: ", userId)
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: userId
            }
        });

        if (user?.isAi == true) {
            return true;
        } else {
            return false
        }
    } catch (errors: any) {
        console.log("error is: ", errors);
        return [];
    }

}

export default isAiUser;