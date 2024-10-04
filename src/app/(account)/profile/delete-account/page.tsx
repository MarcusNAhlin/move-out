"use client";

import BackBtn from "@/components/BackBtn";
import { Alert, Button, Skeleton, Text, Title } from "@mantine/core";
import { useSession } from "next-auth/react";
import { useState } from "react";

export default function DeleteAccount() {
    const { data: session, status } = useSession();
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");


    async function handleDeleteAccount() {

        if (!session?.user?.email) {
            return;
        }

        const response = await fetch(`/api/account/send-delete-email`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: session.user.email }),
        });

        const data = await response.json();

        if (data.id) {
            setError("");
            setMessage("Please verify with your email to delete account permanently");
        }

        if (!data.id) {
            setMessage("");
            setError("Account deletion failed. Please try again later");
        }
    }


    if (status === "loading") {
        return (
            <>
                <BackBtn text="&larr;" href="/" icon />
                <Title>Delete Account</Title>
                <Skeleton height={10} width={"25rem"} radius={"md"} mt={"sm"}  />
                <Skeleton height={10} width={"18rem"} radius={"md"} mt={"sm"}  />
                <Skeleton height={10} width={"10rem"} radius={"md"} mt={"sm"}  />
                <Skeleton height={35} width={"12rem"} radius={"sm"} m={"auto"} mt={"sm"} mb={"sm"} />
            </>
        )
    }

    if (status === "unauthenticated") {
        return (
            <>
                <BackBtn text="&larr;" href="/" icon />
                <Title>Delete Account</Title>
                <p>You are not logged in</p>
            </>
        )
    }

    if (status === "authenticated") {
        return (
            <>
                <BackBtn text="&larr;" href="/profile" icon />
                <Title>Delete Account</Title>
                <Text>Clicking the button below will delete your account and ALL data will be LOST forever</Text>
                <Text>Are you sure you want to delete your account?</Text>
                <Text>{session?.user?.email}</Text>
                <Button onClick={handleDeleteAccount} mt={"sm"} color="red" w={"12rem"}>Delete Account</Button>
                {
                    message && <Alert variant="light" color="yellow" mt={"sm"}>{message}</Alert>
                }
                {
                    error && <Alert variant="light" color="red" mt={"sm"}>{error}</Alert>
                }
            </>
        )
    }
}
