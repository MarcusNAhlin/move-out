"use client";

import BackBtn from "@/components/BackBtn";
import { Text } from "@mantine/core";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";

function VerifyPageContent() {
    let token = null;

    const searchParams = useSearchParams();
    token = searchParams.get('token');

    const [status, setStatus] = useState('Fetching token...');

    useEffect(() => {
        if (!token) {
            setStatus('Invalid token');
        } else {
            fetch('/api/authenticate/token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ inputToken: token }),
            }
        )
        .then((res) => res.json())
        .then((data) => {
            if (data.ok) {
                setStatus('Token verified!');
            } else {
                setStatus('Token verification failed');
            }
        })
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
