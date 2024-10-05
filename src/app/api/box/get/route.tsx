import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

async function getLabels(req: NextRequest) {
    const prisma = new PrismaClient();

    const email: string | null = req.nextUrl.searchParams.get("email") as string;

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
        const labels = await prisma.label.findMany({
            where: {
                userId: userId,
            }
        });

        return NextResponse.json({ message: "Found labels!", error: false, status: 200, ok: true, labels: labels });
    } catch (e) {
        return NextResponse.json({ message: "Error finding labels!", error: true, status: 401, ok: false });
    }

    return NextResponse.json({ message: "Error finding labels!", error: true, status: 401, ok: false });
}

export { getLabels as GET };
