"use client";

import { Button, Text } from "@mantine/core";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function verifyPage() {
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
    }, [])

    return (
        <>
            <div
                style={{
                    width: '90vw',
                    maxWidth: '300px',
                    marginTop: '30vh',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    textAlign: 'center'
                }}
            >
                <Text>{status}</Text>
                <Button
                    component="a"
                    href="/"
                    mt={"lg"}
                >Back to home</Button>
            </div>
        </>
    )
}
