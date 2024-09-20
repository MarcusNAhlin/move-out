"use client";

import BackBtn from "@/components/BackBtn";
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
            <BackBtn text="&larr;" href="/" icon />
            <div style={{
                textAlign: "left",
            }}>
                <h1>Login</h1>
                <form onSubmit={form.onSubmit(handleFormSubmit)}
                    style={{
                        maxWidth: "90vw",
                        width: "300px",
                    }}
                >
                    <TextInput
                        mb={"sm"}
                        label="Email"
                            id="email"
                            placeholder="example@email.com"
                            key={form.key('email')}
                            {...form.getInputProps('email')}
                        />
                    <PasswordInput
                        mb={"sm"}
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
                        textAlign: "center",
                        marginTop: "1rem",
                        lineHeight: "1rem",
                    }}>
                        <a
                            href="/register"
                            style={{
                                fontSize: "0.8rem",
                                textDecoration: "underline",
                                padding: "0.5rem 0",
                            }}
                            >Don't have an account? <br /> Register here
                        </a>
                    </div>
                </form>
            </div>
        </>
    )
}
