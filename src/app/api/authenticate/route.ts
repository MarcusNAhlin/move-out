import { NextRequest, NextResponse, userAgent } from "next/server";
import { PrismaClient } from "@prisma/client";
const bcrypt = require("bcrypt");

async function authenticate(req: NextRequest, res: NextResponse) {
    const prisma = new PrismaClient();
    const { email, password } = await req.json();

    let authenticated = false;

    if (!email || !password) {
        return NextResponse.json({ message: "Missing email or password!", error: true, status: 401, ok: false });
    }

    const user = await prisma.user.findUnique({
        where: { email },
        select: { id: true, verified: true },
    });

    if (!user || !user.id) {
        return NextResponse.json({ message: "Wrong email or password!", error: true, status: 401, ok: false });
    }

    if (!user.verified) {
        return NextResponse.json({ message: "Your account is not verified. Check your email inbox!", error: true, status: 401, ok: false });
    }

    let verifiedUser;

    try {
        const userToVerify = await prisma.user.findUnique({
            where: { id: user.id, verified: true },
            select: {
                id: true,
                hash_pass: true,
                },
        });

        if (userToVerify?.hash_pass) {
            authenticated = await bcrypt.compare(password, userToVerify.hash_pass);
        }


        verifiedUser = await prisma.user.findUnique({
            where: { id: user.id, verified: true },
        });

    } catch (e) {
        return NextResponse.json({ message: "Wrong email or password!", error: true, status: 401, ok: false });
    }

    if (authenticated && verifiedUser) {
        return NextResponse.json({ message: "Login success!", error: false, status: 200, ok: true, user: verifiedUser });

    }

    return NextResponse.json({ message: "Wrong email or password!", error: true, status: 401, ok: false });
}

export { authenticate as POST };
