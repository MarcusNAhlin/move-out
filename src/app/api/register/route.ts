import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import generateToken from "@/lib/generateToken";

// const bcrypt = require("bcrypt");
import bcrypt from "bcrypt";

type User = {
    email: string
}

async function register(req: NextRequest) {
    const prisma = new PrismaClient();
    const { email, password, passwordVerify } = await req.json();

    if (!email || !password || !passwordVerify) {
        return NextResponse.json({ message: "Missing email or password!", error: true, status: 401, ok: false });
    }

    // Match passwords
    if (password !== passwordVerify) {
        return NextResponse.json({ message: "Passwords not matching!", error: true, status: 401, ok: false });
    }

    // Verify email format
    if (/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/.test(email) === false) {
        return NextResponse.json({ message: "Invalid email!", error: true, status: 401, ok: false });
    }

    // Verify password format
    if (/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,}$/.test(password) === false) {
        return NextResponse.json({ message: "Password wrong format!", error: true, status: 401, ok: false });
    }

    let existingUser: User | null = null;

    try {
        existingUser = await prisma.user.findUnique({
            where: {
                email: email
            }
        });
    } catch (e) {
        existingUser = null;
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

        const newToken = generateToken();

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
