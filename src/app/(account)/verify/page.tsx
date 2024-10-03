"use client";

import BackBtn from "@/components/BackBtn";
import { Text } from "@mantine/core";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";

function VerifyPageContent() {
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    const [status, setStatus] = useState('Fetching token...');

    async function getToken() {
        const response = await fetch('/api/authenticate/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ inputToken: token }),
        });

        const data = await response.json();

        console.log(data);

        if (data.ok) {
            setStatus('Mail verified!');
        } else {
            setStatus('Mail verification failed');
        }

        return data;
    }

    useEffect(() => {
        if (status !== 'Fetching token...') {
            return;
        }

        if (!token) {
            setStatus('Invalid token');
        }

        if (token) {
            console.log("has token");
            getToken();
        }
    }, [token])

    return (
        <>
            <BackBtn text="&larr;" href="/" icon />
            <div>
                <Text>{status}</Text>
            </div>
        </>
    )
}

export default function VerifyPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <VerifyPageContent />
        </Suspense>
    );
}
