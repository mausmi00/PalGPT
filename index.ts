import { PrismaClient, Prisma } from '@prisma/client'

const prisma = new PrismaClient()
async function main() {
    // const user = await prisma.user.createMany({
    //     data: [
    //         {
    //             name: 'Elon Musk',
    //             email: "elon_musk@ai.com",
    //             createdAt: new Date(),
    //             updatedAt: new Date(),
    //             image: "/images/elon_musk.jpg",
    //             isAi: true,

    //         }
    //     ]
    // })

    const updatedUser = await prisma.message.update({
        where: {
            id: "6484f97b510b60d037e7d194",
        },
        data: {
            responderShouldBeAi: true
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