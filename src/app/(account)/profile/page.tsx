"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import BackBtn from "@/components/BackBtn";
import { Alert, Button, Skeleton, Text, Title } from "@mantine/core";
import { useState } from "react";

export default function Profile() {
    const { data: session, status } = useSession();
    const [message, setMessage] = useState<string>('');
    const [deactivatingUser, setDeactivatingUser] = useState<boolean>(false);

    async function deactivateUser(email: string | null | undefined) {
        if (!email) {
            return;
        }

        try {
            setDeactivatingUser(true);
            const response = await fetch(`/api/account/deactivate`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email })
            });

            const data = await response.json();

            console.log(data);

            if (data.ok) {
                setMessage("Your account got deactivate successfully");
                setDeactivatingUser(false);
            }

            if (!data.ok) {
                throw new Error(data.message);
            }
        } catch(e) {
            setDeactivatingUser(false);
            setMessage("Could not deactivate your account");
            console.error(e);
        }
    }

    if (status === "loading") {
        return <>
            <BackBtn text="&larr;" href="/" icon />
            <Title order={1}>Profile</Title>
            <Skeleton height={10} width={"15rem"} radius={"md"} mt={"sm"} />
            <Skeleton height={35} width={"12rem"} radius={"sm"} mt={"sm"} mb={"sm"} />
            <Skeleton height={35} width={"12rem"} radius={"sm"} mb={"sm"} />
        </>;
    }

    if (status === "unauthenticated") {
        return <>
            <BackBtn text="&larr;" href="/" icon />
            <Title order={1}>Profile</Title>
            <Text>You are not logged in</Text>
            <Button m={"auto"} mb={"sm"} mt={"sm"} radius={"sm"} w={"12rem"} display={"block"} onClick={() => signIn()}>Log In</Button>
        </>;
    }

    if (status === "authenticated") {
        return (
            <div>
            {
                message &&
                <Alert variant="light" color="orange" maw={"300px"} w={"90%"} m={"sm"}>
                    {message}
                </Alert>
            }
                <BackBtn text="&larr;" href="/" icon />
                <Title order={1}>Profile</Title>
                <Text m={"0"} p={"0"}>Welcome, {session?.user?.email}!</Text>
                <Button m={"auto"} mb={"sm"} mt={"sm"} radius={"sm"} w={"12rem"} display={"block"} onClick={() => signOut()}>Sign Out</Button>
                <Button
                    component="a"
                    href="/profile/delete-account"
                    m={"auto"} mb={"sm"} mt={"sm"} radius={"sm"} color="red" w={"9rem"} display={"block"}>
                        Delete Account
                </Button>

                <Button
                    onClick={() => deactivateUser(session?.user?.email)}
                    disabled={deactivatingUser}
                    m={"auto"} mb={"sm"} mt={"sm"} radius={"sm"} color="orange" w={"12rem"} display={"block"}>
                        Deactivate Account
                </Button>
            </div>
        );
    }
}
