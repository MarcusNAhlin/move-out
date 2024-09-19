"use client";

import { Button, Group, PasswordInput, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Login() {
    const [submittedValues, setSubmittedValues] = useState<typeof form.values | null>(null);
    const router = useRouter();

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
        event?.preventDefault();

        setSubmittedValues

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
                throw new Error("Network response was not ok");
            }
        } catch (e) {
            console.error("Login failed:", e);
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
                <form onSubmit={handleFormSubmit}>
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
                    <Group justify="flex-end" mt="md">
                        <Button type="submit">Login</Button>
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
