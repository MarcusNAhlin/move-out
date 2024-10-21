import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from 'next/server';
// import fs from "fs";

async function deleteAccountAsAdmin(req: NextRequest) {
    const prisma = new PrismaClient();
    const { email, adminEmail } = await req.json();

    if (!email) {
        return NextResponse.json({ message: "Can't find email!", error: true, status: 401, ok: false }, { status: 401, statusText: "Can't find email!"});
    }

    if (!adminEmail) {
        return NextResponse.json({ message: "Invalid admin email", error: true, status: 401, ok: false }, { status: 401, statusText: "Invalid admin email" });
    }

    try {
        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            return NextResponse.json({ message: "Can't find user!", error: true, status: 401, ok: false }, { status: 401, statusText: "Can't find user" });
        }

        if (user.role === "ADMIN") {
            return NextResponse.json({ message: "Cannot delete admin", error: true, status: 401, ok: false }, { status: 401, statusText: "Cannot delete admin" });
        }

        const admin = await prisma.user.findUnique({
            where: { email: adminEmail }
        });

        if (!admin) {
            return NextResponse.json({ message: "Can't find admin!", error: true, status: 401, ok: false }, { status: 401, statusText: "Can't find admin" });
        }

        const boxes = await prisma.box.findMany({
            where: { userId: user.id }
        });

        // Add user to userDeleted table
        await prisma.userDeleted.create({
            data: user
        });

        // Add boxes to boxDeleted table
        for (const box of boxes) {
            await prisma.boxDeleted.create({
                data: box });
        }

        // Delete boxes
        await prisma.box.deleteMany({
            where: { userId: user.id }
        });

        await prisma.verificationToken.deleteMany({
            where: { userId: user.id }
        });

        await prisma.deleteToken.delete({
            where: { id: user.id }
        });

        // Delete user
        await prisma.user.delete({
            where: { id: user.id }
        });

        return NextResponse.json({ message: "Account deleted successfully", ok: true, status: 200 });
    } catch (error) {
        console.log(error);

        return NextResponse.json({ error }, { status: 401, statusText: "Internal server error" });
    }
}

export { deleteAccountAsAdmin as DELETE };
