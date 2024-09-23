import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
    secret: process.env.TOKEN_SECRET,
    session: {
        strategy: "jwt"
    },
    pages: {
        signIn: '/login',

    },
    providers: [
        CredentialsProvider({
            name: 'credentials',
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

                return auth.user;
            }
        })
    ],
    callbacks: {
        async jwt({ token, user, session }) {
            // console.log("jwt", { token, user, session });

            // Add userId and email to token
            if (user) {
                return {
                    ...token,
                    id: user.id,
                    email: user.email
                }
            }

            return token;
        },
        async session({ session, token, user }) {
            // console.log("session", { session, token, user });

            // Add userId and token to session
            return {
                ...session,
                user: {
                    ...session.user,
                    id: token.id,
                    email: token.email
                }
            };

            return session;
        }
        },
})

export { handler as GET, handler as POST };
