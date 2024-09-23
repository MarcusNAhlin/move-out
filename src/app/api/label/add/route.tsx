import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

type User = {
    email: string
}

async function addLabel(req: NextRequest) {
    const prisma = new PrismaClient();
    const { labelTitle, email } = await req.json();

    if (!labelTitle) {
        return NextResponse.json({ message: "Label title!", error: true, status: 401, ok: false });
    }

    if (!email) {
        return NextResponse.json({ message: "No email provided!", error: true, status: 401, ok: false });
    }

    let userId: number | null = null;

    try {
        const user = await prisma.user.findUnique({
            where: {
                email: email
            },
            select: {
                id: true
            }
        });

        if (!user?.id) {
            throw new Error("User not found!");
        }

        userId = user.id;
    } catch (e) {
        return NextResponse.json({ message: "User not found!", error: true, status: 401, ok: false });
    }

    try {
        await prisma.label.create({
            data: {
                userId: userId,
                title: labelTitle,
            }
        });

        return NextResponse.json({ message: "Label created!", error: false, status: 200, ok: true });
    } catch (e) {
        return NextResponse.json({ message: "Error creating label!", error: true, status: 401, ok: false });
    }

    return NextResponse.json({ message: "Error creating label!", error: true, status: 401, ok: false });
}

export { addLabel as POST };
