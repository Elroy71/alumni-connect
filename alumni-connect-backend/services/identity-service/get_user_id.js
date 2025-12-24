import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function getUserId() {
    try {
        const user = await prisma.user.findUnique({
            where: { email: 'example@gmail.com' },
            select: { id: true, email: true }
        });

        if (user) {
            console.log(JSON.stringify(user));
        } else {
            console.log('User not found');
        }
    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        await prisma.$disconnect();
    }
}

getUserId();
