import { NextResponse } from 'next/server';
import { getUsers as getUsersFromDB } from "@/database_calls/user";

async function getUsers() {
    try {
        const users = await getUsersFromDB();

        const response = NextResponse.json({ message: "User found!", ok: true, status: 200, users: users });
        response.headers.set('Cache-Control', 'no-store'); // Disable caching


        return response;
    } catch (error) {
        console.error(error);

        return NextResponse.json({ message: "Error finding users!", error: true, status: 401, ok: false });
    }
}

export { getUsers as GET };
