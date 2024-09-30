"use client";

import { Alert, Button, Group, Select, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LabelAddPage() {
    const router = useRouter();
    const [message, setMessage] = useState("");
    const [addingLabel, setAddingLabel] = useState(false);
    const { data: session, status } = useSession();

    const form = useForm({
        mode: 'uncontrolled',
        initialValues: { labelTitle: '', labelDesign: '' },

        validate: {
            labelTitle: (value: string) => (value.length < 0 ? 'Title too short' :
                                value.length > 50 ? 'Title too long' : null),
        },
    });

    async function handleFormSubmit() {
        setAddingLabel(true);

        const { labelTitle, labelDesign } = form.getValues();

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
                    labelDesign: labelDesign,
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
                        placeholder="Enter a label title"
                        required
                        key={form.key('labelTitle')}
                        {...form.getInputProps('labelTitle')}
                        />
                    <Select
                        label="Label Design"
                        placeholder="Select design"
                        data={["NORMAL", "FRAGILE", "HAZARDOUS"]}
                        required
                        key={form.key('labelDesign')}
                        {...form.getInputProps('labelDesign')}
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
