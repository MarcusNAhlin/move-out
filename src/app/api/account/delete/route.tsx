import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from 'next/server';
import fs from "fs";

async function deleteAccount(req: NextRequest) {
    const prisma = new PrismaClient();
    const { email, token } = await req.json();

    if (!email) {
        return NextResponse.json({ message: "Can't find email!", error: true, status: 401, ok: false }, { status: 401, statusText: "Can't find email"});
    }

    if (!token) {
        return NextResponse.json({ message: "Invalid token", error: true, status: 401, ok: false }, { status: 401, statusText: "Invalid token" });
    }

    try {
        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            return NextResponse.json({ message: "Can't find user!", error: true, status: 401, ok: false }, { status: 401, statusText: "Can't find user" });
        }

        const deleteToken = await prisma.deleteToken.findFirst({
            where: {
                token,
                userId: user.id
            }
        });

        if (!deleteToken) {
            return NextResponse.json({ message: "Invalid token", error: true, status: 401, ok: false }, { status: 401, statusText: "Invalid token" });
        }

        if (deleteToken.expires < new Date()) {

            await prisma.deleteToken.delete({
                where: { id: deleteToken.id }
            });

            return NextResponse.json({ message: "Token expired", error: true, status: 401, ok: false }, { status: 401, statusText: "Token expired" });
        }

        if (deleteToken.token !== token) {
            return NextResponse.json({ message: "Invalid token", error: true, status: 401, ok: false }, { status: 401, statusText: "Invalid token" });
        }

        await prisma.deleteToken.delete({
            where: { id: deleteToken.id }
        });

        await prisma.verificationToken.deleteMany({
            where: { userId: user.id }
        });

        await prisma.label.deleteMany({
            where: { userId: user.id }
        });

        fs.rmSync(`public/images/user-images/${user.id}`, { recursive: true, force: true });
        fs.rmSync(`public/sounds/user-sounds/${user.id}`, { recursive: true, force: true });

        await prisma.user.delete({
            where: { id: user.id }
        });

        return NextResponse.json({ message: "Account deleted successfully", ok: true, status: 200 });
    } catch (error) {
        console.log(error);

        return Response.json({ error }, { status: 500, statusText: "Internal server error" });
    }
}

export { deleteAccount as DELETE };
