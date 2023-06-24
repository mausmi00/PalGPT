import { PrismaClient, Prisma } from '@prisma/client'

const prisma = new PrismaClient()
async function main() {
    // const user = await prisma.user.update({
    //     where: {
    //         id: "648343977f71596b4b97abef"
    //     },
    //     data: {
    //         seenMessageIds: []
    //     }
    // })

    // const createUser = await prisma.user.create({
    //     data: {
    //         name: "Socrates",
    //         email: "socrates@ai.com",
    //         image: "/images/socrates.jpg",
    //         createdAt: new Date(),
    //         updatedAt: new Date(),
    //         isAi: true,
    //         characteristics: "Greek philosopher"
    //     }
    // })

    // const updatedUser = await prisma.message.update({
    //     where: {
    //         id: "6484f97b510b60d037e7d194",
    //     },
    //     data: {
    //         responderShouldBeAi: true
    //     }
    // })

    // const user = await prisma.user.update({
    //     where: {
    //         id: "649222ef4678e55bf8e39998"
    //     },
    //     data: {
    //         seenMessageIds: []
    //     }
    // })


    const conv = await prisma.user.updateMany({
        data: {
            conversationIds: [],
            seenMessageIds: [],
        }
    })

}
main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })