"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import BackBtn from "@/components/BackBtn";
import { Button, Skeleton, Text, Title } from "@mantine/core";

export default function Profile() {
    const { data: session, status } = useSession();

    if (status === "loading") {
        return <>
            <BackBtn text="&larr;" href="/" icon />
            <Title order={1}>Profile</Title>
            <Skeleton height={10} width={"15rem"} radius={"md"} mt={"sm"} />
            <Skeleton height={35} width={"12rem"} radius={"sm"} mt={"sm"} mb={"sm"} />
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
                <BackBtn text="&larr;" href="/" icon />
                <Title order={1}>Profile</Title>
                <Text m={"0"} p={"0"}>Welcome, {session?.user?.email}!</Text>
                <Button m={"auto"} mb={"sm"} mt={"sm"} radius={"sm"} w={"12rem"} display={"block"} onClick={() => signOut()}>Sign Out</Button>
                <Button
                    component="a"
                    href="/profile/delete-account"
                    m={"auto"} mb={"sm"} mt={"sm"} radius={"sm"} color="red" w={"9rem"} display={"block"}>Delete Account</Button>
            </div>
        );
    }
}
