import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

async function getLabel(req: NextRequest) {
    const prisma = new PrismaClient();

    const labelId: string | null = req.nextUrl.searchParams.get("labelId") as string;

    if (!labelId) {
        return NextResponse.json({ message: "No label provided!", error: true, status: 401, ok: false });
    }

    try {
        const label = await prisma.label.findUnique({
            where: {
                id: labelId,
            }
        });

        return NextResponse.json({ message: "Found label!", error: false, status: 200, ok: true, label: label });
    } catch (e) {
        return NextResponse.json({ message: "Error finding label!", error: true, status: 401, ok: false });
    }

    return NextResponse.json({ message: "Error finding label!", error: true, status: 401, ok: false });
}

export { getLabel as GET };
