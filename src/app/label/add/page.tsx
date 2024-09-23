"use client";

import { Alert, Button, Group, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function labelAddPage() {
    const router = useRouter();
    const [message, setMessage] = useState("");
    const [addingLabel, setAddingLabel] = useState(false);
    const { data: session, status } = useSession();

    const form = useForm({
        mode: 'uncontrolled',
        initialValues: { labelTitle: ''},

        validate: {
            labelTitle: (value: string) => (value.length < 0 ? 'Title too short' :
                                value.length > 50 ? 'Title too long' : null),
        },
    });

    async function handleFormSubmit(event: any) {
        setAddingLabel(true);

        const { labelTitle } = form.getValues();

        if (!session?.user?.email) {
            setMessage("You need to be logged in to add labels");
            setAddingLabel(false);
            return;
        }

        try {
            const response: any = await fetch(`/api/label/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    labelTitle: labelTitle,
                    email: session.user.email,
                }),
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
            setAddingLabel(false);
        }
    }

    return ( 
        <>
        {
            status === "authenticated" ?
            <>
                <h1>Add Label</h1>
                <form onSubmit={form.onSubmit(handleFormSubmit)} style={{
                    textAlign: "left",
                }}>
                    <TextInput
                        mb={"sm"}
                        label="Label Title"
                        id="labelTitle"
                        placeholder="Box 1"
                        required
                        key={form.key('labelTitle')}
                        {...form.getInputProps('labelTitle')}
                        />
                    {
                        message ? <Alert variant="light" color="red">
                            {message}
                        </Alert> : <></>
                    }
                    <Group justify="flex-end" mt="md">
                        <Button type="submit" loading={addingLabel}>Add Label</Button>
                    </Group>
                </form>
            </> :
            <>
                <h1>You need to log in to add labels</h1>
            </>
        }
        </>
    )
}
