import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
    pages: {
        signIn: '/login',

    },
    providers: [
        CredentialsProvider({
            name: 'account',


            credentials: {
            email: { label: "Email", type: "email", placeholder: "example@gmail.com" },
            password: { label: "Password", type: "password", placeholder: "********" },
            },

            // Authentication
            async authorize(credentials) {
            const res = await fetch(`${process.env.NEXTAUTH_URL}/api/authenticate`, {
                method: 'POST',
                body: JSON.stringify(credentials),
                headers: { "Content-Type": "application/json" }
            })
            const auth = await res.json();

            if (!auth.ok) {
                throw new Error(auth.message);
            }

            return auth.ok;
            }
        })
    ]
})

export { handler as GET, handler as POST };
