import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

async function getBoxOwner(req: NextRequest) {
    const prisma = new PrismaClient();

    const boxId: string | null = req.nextUrl.searchParams.get("boxId") as string;

    if (!boxId) {
        return NextResponse.json({ message: "No box id provided!", error: true, status: 401, ok: false }, { status: 401, statusText: "No box id provided!" });
    }

    try {
        const boxOwnerId = await prisma.box.findUnique({
            where: {
                id: boxId,
            },
            select: {
                userId: true
            }
        });

        if (!boxOwnerId) {
            return NextResponse.json({ message: "Box not found!", error: true, status: 401, ok: false }, { status: 401, statusText: "Box not found" });
        }

        const boxOwner = await prisma.user.findUnique({
            where: {
                id: boxOwnerId.userId
            }
        });

        return NextResponse.json({ message: "Found box owner!", error: false, status: 200, ok: true, boxOwner: boxOwner });
    } catch (e) {
        return NextResponse.json({ message: "Error finding box!", error: true, status: 401, ok: false });
    }

    return NextResponse.json({ message: "Error finding box!", error: true, status: 401, ok: false });
}

export { getBoxOwner as GET };
