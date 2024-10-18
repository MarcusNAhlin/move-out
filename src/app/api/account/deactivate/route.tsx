import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from 'next/server';

async function deactivateAccount(req: NextRequest) {
    const prisma = new PrismaClient();
    const { email } = await req.json();

    if (!email) {
        return NextResponse.json({ message: "Can't find email!", error: true, status: 401, ok: false }, { status: 401, statusText: "Can't find email!"});
    }

    try {
        await prisma.user.update({
            where: {
                email
            },
            data: {
                deactivated: new Date()
            }
        });

        return NextResponse.json({ message: "Account deactivated successfully", ok: true, status: 200 });
    } catch (error) {
        console.log(error);

        return NextResponse.json({ error }, { status: 401, statusText: "Internal server error" });
    }
}

export { deactivateAccount as POST };
