import prisma from '../../client';
// import { Prisma } from '@prisma/client';

export async function getUserByEmail(email: string) {
    try {
        const user = await prisma.user.findUnique({
            where: {
                email: email
            }
        });

        return user;
    } catch (e: any) {
        console.log(e);
        throw new Error(e);
    }
}
