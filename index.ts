import { PrismaClient, Prisma } from '@prisma/client'

const prisma = new PrismaClient()
async function main() {
    const user = await prisma.user.createMany({
        data: [
            {
                name: 'Jeon Jungkook',
                email: "jeon_jungkook@ai.com",
                createdAt: new Date(),
                updatedAt: new Date(),
                image: "/images/jungkookk.jpg",
                isAi: true,

            }
        ]
    })

    // const updatedUser = await prisma.message.update({
    //     where: {
    //         id: "6484f97b510b60d037e7d194",
    //     },
    //     data: {
    //         responderShouldBeAi: true
    //     }
    // })

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