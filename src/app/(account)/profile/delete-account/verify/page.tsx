"use client";

import BackBtn from "@/components/BackBtn";
import { Alert, Skeleton, Title } from "@mantine/core";
import { signOut, useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function VerifyDeleteAccount() {
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    const { data: session, status } = useSession();
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");


    async function handleDeleteAccount() {
        if(!token) {
            setError("Invalid token");
            return;
        }

        const response = await fetch(`/api/account/delete`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: session?.user?.email, token: token }),
        });

        const data = await response.json();

        if (data.ok) {
            setError("");
            setMessage("Account deleted successfully");
            signOut({ callbackUrl: "/login" });
        }

        if (!data.ok) {
            setMessage("");
            setError("Account deletion failed. Please try again later");
        }
    }

    useEffect(() => {
        if (status !== "loading" && !message && !error) {
            handleDeleteAccount();
        }
    }, [status, message, error]);

    if (status === "loading") {
        return (
            <>
                <BackBtn text="&larr;" href="/" icon />
                <Title>Verify Account Deletion</Title>
                <Skeleton height={50} width={"12rem"} radius={"md"} mt={"sm"}  />
            </>
        )
    }

    return (
        <>
            <BackBtn text="&larr;" href="/profile" icon />
            <Title>Verify Account Deletion</Title>
            {
                message && <Alert variant="light" color="green" mt={"sm"}>{message}</Alert>
            }
            {
                error && <Alert variant="light" color="red" mt={"sm"}>{error}</Alert>
            }
        </>
    )
}
