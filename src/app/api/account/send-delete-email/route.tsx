import { AccountDeleteEmailTemplate } from '@/components/AccountDeleteEmailTemplate';
import { PrismaClient } from "@prisma/client";
import generateToken from '@/lib/generateToken';
import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendDeleteMail(req: NextRequest) {
    const prisma = new PrismaClient();
    const { email } = await req.json();

    if (!email) {
        return NextResponse.json({ message: "Can't find email!", error: true, status: 401, ok: false }, { status: 401, statusText: "Can't find email!" });
    }

    try {
        const newToken = generateToken();

        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            return NextResponse.json({ message: "Can't find user!", error: true, status: 401, ok: false }, { status: 401, statusText: "Can't find user!" });
        }

        await prisma.deleteToken.create({
            data: {
                userId: user.id,
                token: newToken,
                expires: new Date(Date.now() + 1000 * 60 * 60 * 24) // 24 hours
            }
        });

        const { data, error } = await resend.emails.send({
            from: `${process.env.FROM_EMAIL}`,
            to: [email],
            subject: 'Verify Account Deletion MoveOut',
            react: AccountDeleteEmailTemplate({ token: newToken }),
        });

        if (error) {
            throw new Error(error.toString());
        }

        return Response.json(data);
    } catch (error) {
        console.log(error);
        return Response.json({ error }, { status: 500, statusText: "Internal server error" });
    }
}

export { sendDeleteMail as POST };
