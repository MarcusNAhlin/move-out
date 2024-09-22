import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import generateToken from "@/lib/generateToken";
const bcrypt = require("bcrypt");

type User = {
    email: string
}

async function register(req: NextRequest) {
    const prisma = new PrismaClient();
    const { email, password, passwordVerify } = await req.json();

    if (!email || !password || !passwordVerify) {
        return NextResponse.json({ message: "Missing email or password!", error: true, status: 401, ok: false });
    }

    if (password !== passwordVerify) {
        return NextResponse.json({ message: "Passwords not matching!", error: true, status: 401, ok: false });
    }

    if (/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(email) === false) {
        return NextResponse.json({ message: "Invalid email!", error: true, status: 401, ok: false });
    }

    if (password.length < 5 || password.length > 50) {
        return NextResponse.json({ message: "Password must be between 5 and 50 characters!", error: true, status: 401, ok: false });
    }

    try {
        var existingUser: User | null = await prisma.user.findUnique({
            where: {
                email: email
            }
        });
    } catch (e) {
        var existingUser: User | null = null;
    }

    if (existingUser) {
        return NextResponse.json({ message: "Email already in use!", error: true, status: 401, ok: false });
    }

    const saltRounds = 9;

    try {
        const hash = await bcrypt.hash(password, saltRounds);

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
            return NextResponse.json({ message: "Registration failed! Try again.", error: true, status: 401, ok: false });
        }

    return NextResponse.json({ message: "Registration failed! Try again.", error: true, status: 401, ok: false });
}

export { register as POST };
