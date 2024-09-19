
import { NextRequest, NextResponse, userAgent } from "next/server";
import { PrismaClient } from "@prisma/client";

async function authenticateToken(req: NextRequest, res: NextResponse) {
    const prisma = new PrismaClient();
    const { inputToken } = await req.json();


    if (!inputToken) {
        return NextResponse.json({ message: "Missing token!", error: true, status: 401, ok: false });
    }

    try {
        const token = await prisma.verificationToken.findUnique({
            where: { token: inputToken },
            select: { expires: true, userId: true },
        });

        if (token) {
            if (new Date() > token?.expires) {
                return NextResponse.json({ message: "Token expired!", error: true, status: 401, ok: false });
            }

            await prisma.user.update({
                where: { id: token.userId },
                data: { verified: true },
            });

            await prisma.verificationToken.delete({
                where: { token: inputToken },
            });

            return NextResponse.json({ message: "Token verified!", error: false, status: 200, ok: true });
        } else {
            throw new Error("Token not found");
        }

    } catch (e) {
        return NextResponse.json({ message: "Something went wrong!", error: true, status: 401, ok: false });
    }

}

export { authenticateToken as POST };
