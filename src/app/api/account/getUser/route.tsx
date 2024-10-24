import { NextRequest, NextResponse } from 'next/server';
import { getUserByEmail } from "@/database_calls/user";

export const revalidate = 0;

async function getUser(req: NextRequest) {
    const email: string | null = req.nextUrl.searchParams.get("email") as string;

    if (!email) {
        return NextResponse.json({ message: "Can't find email!", error: true, status: 401, ok: false }, { status: 401, statusText: "Can't find email!"});
    }

    try {
        const user = await getUserByEmail(email);

        return NextResponse.json({ message: "User found!", ok: true, status: 200, user: user });
    } catch (error) {
        console.error(error);

        return NextResponse.json({ message: "Error finding user!", error: true, status: 401, ok: false });
    }
}

export { getUser as GET };
