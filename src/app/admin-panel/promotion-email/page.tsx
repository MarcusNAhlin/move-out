"use client";

import BackBtn from "@/components/BackBtn";
import { User } from "@/lib/types";
import { Button, Flex, Group, Loader, Text, Textarea, TextInput, Title } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminPanel() {
    const { data: session } = useSession();
    const [loading, isLoading] = useState<boolean>(true);
    const [user, setUser] = useState<User | null>(null);
    const [sendingEmail, setSendingEmail] = useState<boolean>(false);
    const [message, setMessage] = useState<string | null>(null);

    const router = useRouter();

    useEffect(() => {
        async function getUser() {
            try {
            const user = await fetch(`/api/account/getUser?email=${session?.user?.email}`, {
                method: "GET",
                headers: {
                "Content-Type": "application/json",
                }});

            const data = await user.json();

            if (data.ok) {
                setUser(data.user);
                return user;
            }

            if (!data.ok) {
                throw new Error(data.message)
            }
            } catch (e) {
            return console.error(e);
            }
        }

        if (!user) {
            getUser();
            isLoading(false);
        }

    }, [session]);

    const form = useForm({
        mode: 'uncontrolled',
            initialValues: { subject: '', mailContent: '',},

            validate: {
                subject: (value) => (value.length < 1 ? 'Subject too short' : null),
                mailContent: (value) => (value.length < 1 ? 'Email content too short' : null)
            },
        });

    async function handleFormSubmit() {
        setSendingEmail(true);

        const { subject, mailContent } = form.getValues();

        try {
            const response: any = await fetch("/api/admin/sendPromotionEmail", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ subject, mailContent }),
            });

            const data = await response.json();

            if (data.ok) {
                setSendingEmail(false);
                setMessage(data.message);
            }

            if (!data.ok) {
                throw new Error(data.message);
            }
        } catch (e: any) {
            setMessage(e);
            setSendingEmail(false);
        }
    }

    if (loading) {
        return (<>
            <Loader size={"lg"} />
        </>)
    }

    if (user && user.role !== "ADMIN") {
        router.push("/");
        router.refresh();
    }

    if (user && user.role === "ADMIN") {
        return (<>
            <BackBtn text="&larr;" href={`/`} icon />
            <Title order={1}>Promotion Email</Title>
            <form
                onSubmit={form.onSubmit(handleFormSubmit)}
                style={{
                    textAlign: "left",
                    width: "90vw",
                    maxWidth: "500px",
                }}
            >
                <TextInput
                    mt={"sm"}
                    label={"Subject:"}
                    placeholder="Special Offer!"
                    type="text"
                    key={form.key('subject')}
                    {...form.getInputProps('subject')}
                />
                <Textarea
                    mt={"sm"}
                    label="Email Content"
                    placeholder={`<h1>This is an example of an email</h1>
<p>Write it in HTML</p>
<a href="https://example.com">Links also work</a>
                    `}
                    autosize
                    minRows={10}
                    key={form.key('mailContent')}
                    {...form.getInputProps('mailContent')}
                />
                <Group justify="flex-end" mt="md">
                    <Button type="submit" loading={sendingEmail}>Send Email</Button>
                </Group>
            </form>
            {
                message ? <Flex justify="center" mt="md">
                    <Text>{message}</Text>
                </Flex> : <></>
            }
        </>)
    }
}
