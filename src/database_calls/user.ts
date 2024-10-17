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

export async function getUserById(id: number) {
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: id
            }
        });

        return user;
    } catch (e: any) {
        console.log(e);
        throw new Error(e);
    }
}

export async function getUsers() {
    try {
        const users = await prisma.user.findMany();

        return users;
    } catch (e: any) {
        console.log(e);
        throw new Error(e);
    }
}
