"use client";

import BackBtn from "@/components/BackBtn";
import { Alert, Button, FileInput, Flex, Group, Select, TextInput, Textarea, Title, Switch } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function LabelAddPage() {
    const router = useRouter();
    const [message, setMessage] = useState("");
    const [addingLabel, setAddingLabel] = useState(false);
    const { data: session, status } = useSession();

    const [isRecording, setIsRecording] = useState(false);
    const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
    const [chunks, setChunks] = useState<Blob[]>([]);
    const [blob, setBlob] = useState<Blob | null>(null);

    // For linter
    chunks;

    const form = useForm({
        mode: 'uncontrolled',
        initialValues: { boxTitle: '', labelDesign: '', boxTextContent: '', boxImage: null, labelPrivacy: false },

        validate: {
            boxTitle: (value: string) => (value.length < 0 ? 'Title too short' :
                                value.length > 50 ? 'Title too long' : null),
            boxImage: (value: any) => (value && value.size > 10000000 ? 'Image too big, max 10 MB' : null),
        },
    });

    async function handleFormSubmit(values: any) {
        setAddingLabel(true);

        if (!session?.user?.email) {
            setMessage("You need to be logged in to add labels");
            setAddingLabel(false);
            return;
        }

        const formData = new FormData();
        formData.append('email', session.user.email);
        formData.append('boxTitle', values.boxTitle);
        formData.append('labelDesign', values.labelDesign);
        formData.append('boxTextContent', values.boxTextContent);
        formData.append('boxPrivate', values.labelPrivacy);

        if (values.boxImage) {
            formData.append('boxImage', values.boxImage);
        }

        if (blob) {
            formData.append('boxSound', blob);
        }

        try {
            const response: any = await fetch(`/api/box/add`, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error(response.error);
            }

            if (response.ok) {
                router.push("/");
                router.refresh();
            }
        } catch (e: any) {
            setMessage(e.message);
            setAddingLabel(false);
        }
    }

    // Start media recorder
    // https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder
    async function startMediaRecorder() {
        if (!window.MediaRecorder) {
            setMessage("MediaRecorder is not supported on your device. Try another browser.");
        }

        setMessage("MediaRecorder is supported on your device");

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const recorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });

            setMediaRecorder(recorder);

            recorder.ondataavailable = (e) => {
                setChunks((prevChunks) => [...prevChunks, e.data]);
            };

            recorder.onstop = () => {
                // Ensure latest data, removes issues with states
                setChunks((prevChunks) => {
                    const blob = new Blob(prevChunks, { type: 'audio/webm' });
                    const url = window.URL.createObjectURL(blob);

                    setBlob(blob);

                    const audioPlayer = document.getElementById('audio-recording') as HTMLAudioElement;

                    audioPlayer.src = url;

                    return prevChunks;
                });
            };
        } catch (e) {
            console.error(`An error occurred: ${e}`);
        }
    };

    useEffect(() => {
        startMediaRecorder();
    }, []);

    // Start/stop recording when button is pressed
    async function handleRecording() {
        if (mediaRecorder) {
            if (!isRecording) {
                setChunks([]); // Reset chunks
                mediaRecorder.start();
            }
            if (isRecording) {
                if (mediaRecorder.state === "recording") {
                    mediaRecorder.stop();
                }
            }

            setIsRecording(!isRecording);
        }
    };

    return ( 
        <>
        {
            status === "authenticated" ?
            <>
                <BackBtn text="&larr;" href="/" icon />

                <Title order={1}>Add Box</Title>
                <form onSubmit={form.onSubmit(handleFormSubmit)} style={{
                    textAlign: "left",
                }}>
                    <TextInput
                        mb={"sm"}
                        label="Box Title"
                        id="boxTitle"
                        placeholder="Enter a box title"
                        required
                        key={form.key('boxTitle')}
                        {...form.getInputProps('boxTitle')}
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
                        mb={"sm"}
                        label="Box Content"
                        placeholder={`Item 1\nItem 2\nItem 3\nItem 4\n...`}
                        minRows={5}
                        autosize
                        key={form.key('boxTextContent')}
                        {...form.getInputProps('boxTextContent')}
                    />
                    <FileInput
                        mb={"sm"}
                        size="md"
                        label="Image"
                        placeholder="Click to add image"
                        key={form.key('boxImage')}
                        {...form.getInputProps('boxImage')}
                    />
                    <Flex direction="column" >
                        <label htmlFor="audio-recording">Audio Note</label>
                        <audio controls id="audio-recording">
                            Your browser does not support the audio element.
                        </audio>
                        <Flex direction={"row"} justify={"center"} mb={"sm"}>
                            {
                                isRecording ? <Button color="red" onClick={handleRecording}>Stop Recording</Button> :
                                <Button color="blue" onClick={handleRecording}>Record</Button>
                            }
                        </Flex>
                    </Flex>
                    <label htmlFor="label-privacy">Box Privacy</label>
                    <Switch
                        size="xl"
                        mb={"sm"}
                        offLabel="Public"
                        onLabel="Private"
                        id="label-privacy"
                        key={form.key('labelPrivacy')}
                        {...form.getInputProps('labelPrivacy')}
                    />
                    {
                        message ? <Alert variant="light" color="red">
                            {message}
                        </Alert> : <></>
                    }
                    <Group justify="flex-end" mt="md">
                        <Button type="submit" loading={addingLabel}>Add Box</Button>
                    </Group>
                </form>
            </> :
            <>
                <BackBtn text="&larr;" href="/" icon />
                <Title order={1}>You need to log in to add boxes</Title>
            </>
        }
        </>
    )
}
