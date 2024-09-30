import prisma from '../../client';
import { Prisma } from '@prisma/client';

export async function registerUser(user: Prisma.UserUncheckedCreateInput) {
    try {
        return await prisma.user.create({
            data: user
        });
    } catch (e: any) {
        throw new Error(e);
    }
}
