"use client";

import { Alert, Button, Group, PasswordInput, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Login() {
    const router = useRouter();

    const [loggingIn, setLoggingIn] = useState(false);
    const [message, setMessage] = useState("");

    const form = useForm({
        mode: 'uncontrolled',
        initialValues: { email: '', password: '',},

        validate: {
            email: (value) => (value.length < 5 ? 'Email too short' :
                                value.length > 50 ? 'Email too long' : null),
            password: (value) => (value.length < 5 ? 'Password too short' :
                                    value.length > 50 ? 'Password too long' : null),
        },
        });

    async function handleFormSubmit(event:any) {
        setLoggingIn(true);
        const { email, password } = form.getValues();

        try {
            const response: any = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            if (!response?.error) {
                router.push("/");
                router.refresh();
            }

            if (!response.ok) {
                throw new Error(response.error);
            }
        } catch (e: any) {
            setMessage(e.message);
            setLoggingIn(false);
        }
    }

    return (
        <>
            <div style={{
                width: "90vw",
                maxWidth: "300px",
                marginTop: "30vh",
                marginLeft: "auto",
                marginRight: "auto",
            }}>
                <form onSubmit={form.onSubmit(handleFormSubmit)}>
                    <TextInput
                        label="Email"
                            id="email"
                            placeholder="example@email.com"
                            key={form.key('email')}
                            {...form.getInputProps('email')}
                        />
                    <PasswordInput
                        label="Password"
                        id="password"
                        placeholder="**********"
                        key={form.key('password')}
                        {...form.getInputProps('password')}
                    />
                    {
                        message ? <Alert variant="light" color="red">
                            {message}
                        </Alert> : <></>
                    }
                    <Group justify="flex-end" mt="md">
                        <Button type="submit" loading={loggingIn}>Login</Button>
                    </Group>
                    <div
                    style={{
                        textAlign: "center"
                    }}>
                        <a
                            href="/register"
                            style={{
                                marginTop: "2rem",
                                fontSize: "0.8rem",
                                textDecoration: "underline"
                            }}
                            >Don't have an account? Register here
                        </a>
                    </div>
                </form>
            </div>
        </>
    )
}
