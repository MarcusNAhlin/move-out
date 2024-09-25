import prisma from '../../client';
import { Prisma, Role, LabelType } from '@prisma/client';
import { User } from '@/lib/types';

export async function registerUser(user: Prisma.UserUncheckedCreateInput) {
    try {
        return await prisma.user.create({
            data: user
        });
    } catch (e: any) {
        throw new Error(e);
    }
}
