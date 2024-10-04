import { VerifyEmailTemplate } from '@/components/VerifyEmailTemplate';
import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendEmail(req: NextRequest) {

    const { email, token } = await req.json();


    if (!email || !token) {
        return NextResponse.json({ message: 'Missing email or token!', error: true, status: 401, ok: false });
    }

    try {
        const { data, error } = await resend.emails.send({
            from: `${process.env.FROM_EMAIL}`,
            to: [email],
            subject: 'Verify Account MoveOut',
            react: VerifyEmailTemplate({ token: token }),
        });

        if (error) {
            return Response.json({ error }, { status: 500 });
        }

        return Response.json(data);
    } catch (error) {
        return Response.json({ error }, { status: 500 });
    }
}

export { sendEmail as POST };
