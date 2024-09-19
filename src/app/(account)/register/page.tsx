"use client";

import { Button, Group, PasswordInput, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Login() {
    const router = useRouter();
    const [isRegistering, setIsRegistering] = useState(false);

    const form = useForm({
        mode: 'uncontrolled',
        initialValues: { email: '', password: '', passwordVerify: '' },

        validate: {
            email: (value:string): string | null => (value.length < 5 ? 'Email too short' :
                                value.length > 50 ? 'Email too long' : null),
            password: (value:string): string | null => (value.length < 5 ? 'Password too short' :
                                    value.length > 50 ? 'Password too long' : null),
            passwordVerify: (value: string, values: any):string | null => (value !== values.password ? 'Passwords do not match' : null)
        },
        });

    async function handleFormSubmit(event:any) {
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

            if (!response.ok) {
                setIsRegistering(false);
                throw new Error("Network response was not ok");
            }

            if (response.ok) {
                router.push("/login");
                router.refresh();
            }

        } catch (e) {
            setIsRegistering(false);
            console.error("Registration failed:", e);
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
                    <PasswordInput
                        label="Verify Password"
                        id="passwordVerify"
                        placeholder="**********"
                        key={form.key('passwordVerify')}
                        {...form.getInputProps('passwordVerify')}
                    />
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
