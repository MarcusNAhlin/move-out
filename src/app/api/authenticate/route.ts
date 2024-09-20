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

    try {
        const userVerified = await prisma.user.findUnique({
            where: { id: user.id, verified: true },
            select: { hash_pass: true },
        });

        if (userVerified?.hash_pass) {
            authenticated = await bcrypt.compare(password, userVerified.hash_pass);
        }
    } catch (e) {
        return NextResponse.json({ message: "Wrong email or password!", error: true, status: 401, ok: false });
    }

    if (authenticated) {
        return NextResponse.json({ message: "Login success!", error: false, status: 200, ok: true });
    }

    return NextResponse.json({ message: "Wrong email or password!", error: true, status: 401, ok: false });
}

export { authenticate as POST };
