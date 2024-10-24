import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { PrismaClient } from "@prisma/client";

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendPromotionEmail(req: NextRequest) {
    const prisma = new PrismaClient();

    const { from, subject, mailContent } = await req.json();

    if (!from) {
        return NextResponse.json({ message: 'Missing from-user!', error: true, status: 401, ok: false });
    }

    if (!subject) {
        return NextResponse.json({ message: 'Missing subject!', error: true, status: 401, ok: false });
    }

    if (!mailContent) {
        return NextResponse.json({ message: 'Missing email content!', error: true, status: 401, ok: false });
    }

    let userEmails;
    let emailsSent = 0;
    let numberOfEmails = 0;

    try {
        userEmails = await prisma.user.findMany({
            select: { email: true },
        });
    } catch (e) {
        return NextResponse.json({ message: 'Error fetching emails!', error: true, status: 401, ok: false });
    }

    for (const user of userEmails) {
        try {
            numberOfEmails++;

            const { error } = await resend.emails.send({
                from: `${process.env.FROM_EMAIL}`,
                to: [user.email],
                subject: subject,
                html: mailContent,
            });

            if (error) {
                throw new Error(error.message);
            }

            emailsSent++;
        } catch (e) {
            console.error(e);
        }
    }

    if (emailsSent > 0) {
        return NextResponse.json({ message: `${emailsSent}/${numberOfEmails} emails sent.`, error: false, status: 200, ok: true });
    }

    return NextResponse.json({ message: 'No emails sent!', error: true, status: 401, ok: false });
}

export { sendPromotionEmail as POST };
