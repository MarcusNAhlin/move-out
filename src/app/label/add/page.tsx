"use client";

import { Alert, Button, FileInput, Group, Select, TextInput, Textarea } from "@mantine/core";
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
        initialValues: { labelTitle: '', labelDesign: '', labelTextContent: '', labelImage: null },

        validate: {
            labelTitle: (value: string) => (value.length < 0 ? 'Title too short' :
                                value.length > 50 ? 'Title too long' : null),
            labelImage: (value: any) => (value && value.size > 10000000 ? 'Image too big, max 10 MB' : null),
        },
    });

    async function handleFormSubmit(values: any) {
        setAddingLabel(true);

        // const { labelTitle, labelDesign, labelTextContent, labelImage } = form.getValues();



        if (!session?.user?.email) {
            setMessage("You need to be logged in to add labels");
            setAddingLabel(false);
            return;
        }

        const formData = new FormData();
        formData.append('email', session.user.email);
        formData.append('labelTitle', values.labelTitle);
        formData.append('labelDesign', values.labelDesign);
        formData.append('labelTextContent', values.labelTextContent);
        if (values.labelImage) {
            formData.append('labelImage', values.labelImage);
        }

        try {
            // const response: any = await fetch(`/api/label/add`, {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json',
            //     },
            //     body: JSON.stringify({
            //         labelTitle: labelTitle,
            //         labelDesign: labelDesign,
            //         labelTextContent: labelTextContent,
            //         labelImage: labelImage,
            //         email: session.user.email,
            //     }),
            // });
            const response: any = await fetch(`/api/label/add`, {
                method: 'POST',
                body: formData,
                cache: 'no-store'
            });

            console.log(response);

            if (!response.ok) {
                throw new Error(response.error);
            }

            if (!response?.error) {
                router.push("/");
                router.refresh();
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
                        mb={"sm"}
                        label="Label Design"
                        placeholder="Select design"
                        data={["NORMAL", "FRAGILE", "HAZARDOUS"]}
                        required
                        key={form.key('labelDesign')}
                        {...form.getInputProps('labelDesign')}
                    />
                    <Textarea
                        label="Box Content"
                        placeholder={`Item 1\nItem 2\nItem 3\nItem 4\nItem 5`}
                        minRows={5}
                        autosize
                        key={form.key('labelTextContent')}
                        {...form.getInputProps('labelTextContent')}
                    />
                    <FileInput
                        size="md"
                        label="Image"
                        placeholder="Click to add image"
                        key={form.key('labelImage')}
                        {...form.getInputProps('labelImage')}
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
