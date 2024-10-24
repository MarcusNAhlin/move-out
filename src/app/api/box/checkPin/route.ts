import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

export const revalidate = 0;

async function checkPin(req: NextRequest) {
    const prisma = new PrismaClient();

    const { boxId, pinCode } = await req.json();

    if (!boxId) {
        return NextResponse.json({ message: "No box provided!", error: true, status: 401, ok: false });
    }

    if (!pinCode) {
        return NextResponse.json({ message: "No pin provided!", error: true, status: 401, ok: false });
    }

    try {
        const box = await prisma.box.findUnique({
            where: {
                id: boxId,
            },
            select: {
                private: true,
                pin: true
            }
        });

        if (!box) {
            return NextResponse.json({ message: "Can't find box!", error: true, status: 401, ok: false });
        }

        if (box.pin !== pinCode) {
            return NextResponse.json({ message: "Pin incorrect!", error: true, status: 401, ok: false });
        }

        if (box.private && box.pin === pinCode) {
            return NextResponse.json({ message: "Pin correct!", error: false, status: 200, ok: true });
        }
    } catch (e) {
        return NextResponse.json({ message: "Error finding box!", error: true, status: 401, ok: false });
    }

    return NextResponse.json({ message: "Error finding box!", error: true, status: 401, ok: false });
}

export { checkPin as POST };
