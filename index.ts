import { PrismaClient, Prisma } from '@prisma/client'

const prisma = new PrismaClient()
async function main() {
//     // const user = await prisma.user.update({
//     //     where: {
//     //         id: "648343977f71596b4b97abef"
//     //     },
//     //     data: {
//     //         seenMessageIds: []
//     //     }
//     // })

//     // const createUser = await prisma.user.create({
//     //     data: {
//     //         name: "Socrates",
//     //         email: "socrates@ai.com",
//     //         image: "/images/socrates.jpg",
//     //         createdAt: new Date(),
//     //         updatedAt: new Date(),
//     //         isAi: true,
//     //         characteristics: "Greek philosopher"
//     //     }
//     // })

//     const updatedUser = await prisma.user.update({
//         where: {
//             id: "6496f832f91b008949a2f483",
//         },
//         data: {
//             characteristics: "I'm someone who feels deeply and isn't afraid to let my emotions show through tears"
//         }
//     })

//     // const user = await prisma.user.update({
//     //     where: {
//     //         id: "649222ef4678e55bf8e39998"
//     //     },
//     //     data: {
//     //         seenMessageIds: []
//     //     }
//     // })


    // const conv = await prisma.user.updateMany({
    //     data: {
    //         conversationIds: [],
    //         seenMessageIds: [],
    //     }
    // })

    const user = await prisma.user.update({
        where: {
            id: "64898369ea3dd1367711b4ff"
        },
        data: {
            image: "/images/bro.png"
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