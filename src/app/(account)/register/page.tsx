"use client";

import BackBtn from "@/components/BackBtn";
import { Alert, Button, Group, PasswordInput, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Login() {
    const router = useRouter();
    const [isRegistering, setIsRegistering] = useState(false);
    const [message, setMessage] = useState("");

    const form = useForm({
        mode: 'uncontrolled',
        initialValues: { email: '', password: '', passwordVerify: '' },

        validate: {
            email: (value:string): string | null => (value.length < 5 ? 'Email too short' :
                                value.length > 50 ? 'Email too long' : /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(value) ? null : "Invalid email"),
            password: (value:string): string | null => (value.length < 5 ? 'Password too short' :
                                    value.length > 50 ? 'Password too long' : null),
            passwordVerify: (value: string, values: any):string | null => (value !== values.password ? 'Passwords do not match' : null)
        },
        });

    async function handleFormSubmit() {
        setIsRegistering(true);
        const { email, password, passwordVerify } = form.getValues();

        try {
            const response: any = await fetch(`/api/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password, passwordVerify }),
            });

            const data = await response.json();

            if (!data.ok) {
                throw new Error(data.message);
            }

            if (data.ok) {
                router.push("/login");
                router.refresh();
            }

        } catch (e: any) {
            setMessage(e.message);
            setIsRegistering(false);
        }
    }

    return (
        <>
            <BackBtn text="&larr;" href="/" icon />
            <div style={{
                textAlign: "left",
            }}>
                <h1>Register</h1>
                <form onSubmit={form.onSubmit(handleFormSubmit)}
                    style={{
                        maxWidth: "90vw",
                        width: "300px",
                    }}
                >
                    <TextInput
                        mb="sm"
                        label="Email"
                            id="email"
                            placeholder="example@email.com"
                            key={form.key('email')}
                            {...form.getInputProps('email')}
                        />
                    <PasswordInput
                        mb="sm"
                        label="Password"
                        id="password"
                        placeholder="**********"
                        key={form.key('password')}
                        {...form.getInputProps('password')}
                    />
                    <PasswordInput
                        mb="sm"
                        label="Verify Password"
                        id="passwordVerify"
                        placeholder="**********"
                        key={form.key('passwordVerify')}
                        {...form.getInputProps('passwordVerify')}
                    />
                    {
                        message ? <Alert variant="light" color="red">
                            {message}
                        </Alert> : <></>
                    }
                    <Group justify="flex-end" mt="md">
                        <Button type="submit" loading={isRegistering}>Register</Button>
                    </Group>
                    <div
                    style={{
                        textAlign: "center"
                    }}>
                    </div>
                </form>
            </div>
        </>
    )
}
