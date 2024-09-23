
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from "@prisma/client";

export async function generateSession(req: NextRequest, res: NextResponse) {
    const prisma = new PrismaClient();
    let { userId } = await req.json();

    if (!userId) {
        return NextResponse.json({ message: "Missing user id!", error: true, status: 401, ok: false });
    }

    userId = Number(userId);

    try {
        const generatedAccessToken = crypto.randomUUID();

        await prisma.user.update({
            where: { id: userId },
            data: { accessToken: generatedAccessToken }
        });

        return NextResponse.json({ message: "Accesstoken added", error: false, status: 200, ok: true, accessToken: generatedAccessToken });
    } catch (e) {
        return NextResponse.json({ message: "Something went wrong!", error: true, status: 401, ok: false });
    }
}

export { generateSession as POST };
