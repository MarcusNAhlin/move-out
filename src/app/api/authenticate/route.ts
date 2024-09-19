import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

async function authenticate(req: NextRequest, res: NextResponse) {
    const prisma = new PrismaClient();
    const { csrfToken, email, password } = await req.json();

    let authenticated = false;

    if (!email || !password) {
        console.log("here");
        return NextResponse.json({ message: "Missing email or password!", error: true, status: 401, ok: false });
    }

    const authenticatedUser = await prisma.user.findUnique({
        where: { email, verified: true  },
        select: { id: true },
    });

    if (!authenticatedUser || !authenticatedUser.id) {
        console.log("here2");
        return NextResponse.json({ message: "No account found!", error: true, status: 401, ok: false });
    }

    const hashedPassword = await prisma.user.findUnique({
        where: { id: authenticatedUser.id },
        select: { hash_pass: true },
    });

    if (hashedPassword?.hash_pass === password) {
        authenticated = true;
    }

    if (authenticated) {
        return NextResponse.json({ message: "Authenticated!", error: false, status: 200, ok: true });
    }

    console.log("here3");
    return NextResponse.json({ message: "Authentication failed!", error: true, status: 401, ok: false });
}

export { authenticate as POST };
