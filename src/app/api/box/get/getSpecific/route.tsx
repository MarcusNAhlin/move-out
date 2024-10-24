import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

export const revalidate = 0;

async function getLabel(req: NextRequest) {
    const prisma = new PrismaClient();

    const boxId: string | null = req.nextUrl.searchParams.get("boxId") as string;

    if (!boxId) {
        return NextResponse.json({ message: "No box provided!", error: true, status: 401, ok: false });
    }

    try {
        const box = await prisma.box.findUnique({
            where: {
                id: boxId,
            }
        });

        return NextResponse.json({ message: "Found box!", error: false, status: 200, ok: true, box: box });
    } catch (e) {
        return NextResponse.json({ message: "Error finding box!", error: true, status: 401, ok: false });
    }

    return NextResponse.json({ message: "Error finding box!", error: true, status: 401, ok: false });
}

export { getLabel as GET };
