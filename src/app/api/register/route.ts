import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import generateToken from "@/lib/generateToken";
const bcrypt = require("bcrypt");

async function register(req: NextRequest, res: NextResponse) {
    const prisma = new PrismaClient();
    const { email, password, passwordVerify } = await req.json();

    if (!email || !password || !passwordVerify) {
        return NextResponse.json({ message: "Missing email or password!", error: true, status: 401, ok: false });
    }


    const existingUser = await prisma.user.findUnique({
        where: {
            email: email
        }
    });

    if (existingUser) {
        return NextResponse.json({ message: "Email already in use!", error: true, status: 402, ok: false });
    }

    const saltRounds = 9;

    bcrypt.hash(password, saltRounds, async function(err:any, hash: string) {
        try {
            const newUser = await prisma.user.create({
                data: {
                    email: email,
                    hash_pass: hash
                }
            });

            let newToken = generateToken();

            await prisma.verificationToken.create({
                data: {
                    userId: newUser.id,
                    token: newToken,
                    expires: new Date(Date.now() + 1000 * 60 * 60 * 24) // 24 hours
                }
            });

            await fetch(`${process.env.NEXTAUTH_URL}/api/authenticate/token/sendMail`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: email, token: newToken }),
            });

            return NextResponse.json({ message: "Registration successful", error: false, status: 200, ok: true});
        } catch (e) {
            return NextResponse.json({ message: "Registration failed!", error: true, status: 403, ok: false });
        }
    });

    return NextResponse.json({ message: "Registration failed!", error: true, status: 401, ok: false });
}

export { register as POST };
