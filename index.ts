import { PrismaClient, Prisma } from '@prisma/client'

const prisma = new PrismaClient()
async function main() {
    const user = await prisma.user.update({
        where: {
            id: "648343977f71596b4b97abef"
        },
        data: {

            characteristics: "mean"
        }
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