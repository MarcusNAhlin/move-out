"use client";

import BackBtn from "@/components/BackBtn";
import { Alert, Button, FileInput, Flex, Group, Image, Loader, Select, Switch, TextInput, Textarea, Title } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Box, User } from "@/lib/types";

export default function BoxEditPage() {
    const routerParams = useParams();
    const router = useRouter();

    const { id } = routerParams;

    const [loading, setLoading] = useState(true);

    const [message, setMessage] = useState("");
    const [addingBox, setAddingBox] = useState(false);
    const { data: session, status } = useSession();

    const [isRecording, setIsRecording] = useState(false);
    const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
    const [chunks, setChunks] = useState<Blob[]>([]);
    const [blob, setBlob] = useState<Blob | null>(null);

    const [boxData, setBoxData] = useState<Box | null>(null);
    const [boxOwner, setBoxOwner] = useState<User | null>(null);


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

    async function handleBoxDelete() {
        setAddingBox(true);

        if (!session?.user?.email) {
            setMessage("You need to be logged in to delete a box");
            setAddingBox(false);
            return;
        }

        try {
            const res = await fetch(`/api/box/delete?boxId=${id}`, {
                method: "DELETE",
            });

            const data = await res.json();

            if (data.error) {
                throw new Error(data.message);
            }

            if (!data.error) {
                router.push(`/`);
                router.refresh();
            }
        } catch (e: any) {
            setMessage(e);
            setAddingBox(false);
        }
    }

    async function handleFormSubmit(values: any) {
        setAddingBox(true);

        if (!session?.user?.email) {
            setMessage("You need to be logged in to add labels");
            setAddingBox(false);
            return;
        }

        const formData = new FormData();
        formData.append('id', id as string);
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
            const response: any = await fetch(`/api/box/edit`, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error(response.error);
            }

            if (!response?.error) {
                router.push(`/box/${id}`);
                router.refresh();
            }
        } catch (e: any) {
            setMessage(e.message);
            setAddingBox(false);
        }
    }

    // Start media recorder
    // https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder
    async function startMediaRecorder() {
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

    async function getBoxData() {
        if (boxData) {
            return;
        }

        try {
            const response = await fetch(`/api/box/get/getSpecific?boxId=${id}`, {
                method: "GET",
            });

            const data = await response.json();

            if (!data.ok) {
                throw new Error(data.message);
            }

            setBoxData(data.box);
        } catch (e: any) {
            console.error(e);
            setMessage(e);
        }
    }

    async function getBoxOwner(boxId: string) {
        try {
            const response = await fetch(`/api/box/get/boxOwner?boxId=${boxId}`, {
                method: "GET",
            });

            const data = await response.json();

            if (!data.ok) {
                throw new Error(data.message);
            }

            setBoxOwner(data.boxOwner);

            return data;
        } catch (e: any) {
            console.error(e);
            setMessage(e);

            return e;
        }
    }

    useEffect(() => {
        getBoxData();

        startMediaRecorder();
    }, [id]);

    useEffect(() => {
        if (boxData) {
            getBoxOwner(boxData.id);
        }
    }, [boxData]);

    useEffect(() => {
        if (boxData && boxOwner) {
            setLoading(false);
            console.log(session?.user?.email === boxOwner.email);
        }
    }, [boxData, boxOwner]);

    useEffect(() => {
        if (boxData) {
            form.setValues({
                boxTitle: boxData.title,
                labelDesign: boxData.type,
                boxTextContent: boxData.text,
                labelPrivacy: boxData.private,
            });
        }

    }, [boxData]);


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

    if (session?.user?.email !== boxOwner?.email && boxOwner?.email !== undefined && session?.user?.email !== undefined) {
        return <>
            {
                loading && <>
                    <BackBtn text="&larr;" href={`/box/${id}`} icon />
                    <Loader size={"lg"} />
                </>
            }
            {
                !loading && <>
                <BackBtn text="&larr;" href={`/box/${id}`} icon />
                <Title>You can&apos;t edit this box</Title>
                </>
            }
        </>;
    }

    return (
        <>
        {
            loading && <>
                <BackBtn text="&larr;" href={`/box/${id}`} icon />
                <Loader size={"lg"} />
            </>
        }
        {
            status === "authenticated" && !loading &&
            <>
                <BackBtn text="&larr;" href={`/box/${boxData?.id}`} icon />

                <Title order={1}>Edit Box</Title>
                <form onSubmit={form.onSubmit(handleFormSubmit)} style={{
                    textAlign: "left",
                }}>
                    <TextInput
                        mb={"sm"}
                        label="Box Title"
                        id="boxTitle"
                        placeholder="Enter a box title"
                        required
                        disabled={!boxData}
                        key={form.key('boxTitle')}
                        {...form.getInputProps('boxTitle')}
                        />
                    <Select
                        mb={"sm"}
                        label="Label Design"
                        placeholder="Select design"
                        data={["NORMAL", "FRAGILE", "HAZARDOUS"]}
                        required
                        disabled={!boxData}
                        key={form.key('labelDesign')}
                        {...form.getInputProps('labelDesign')}
                    />
                    <Textarea
                        mb={"sm"}
                        label="Box Content"
                        placeholder={`Item 1\nItem 2\nItem 3\nItem 4\n...`}
                        minRows={5}
                        autosize
                        disabled={!boxData}
                        key={form.key('boxTextContent')}
                        {...form.getInputProps('boxTextContent')}
                    />
                    <FileInput
                        mb={"sm"}
                        size="md"
                        label="Image"
                        placeholder="Click to add image"
                        disabled={!boxData}
                        key={form.key('boxImage')}
                        {...form.getInputProps('boxImage')}
                    />
                    {
                        (boxData?.imageName) ?
                        <Image src={`/images/user-images/${boxData?.userId}/${boxData?.id}/${boxData?.imageName}`}
                        alt="Box content image" maw={"50vw"} /> : null
                    }
                    <Flex direction="column" >
                        <label htmlFor="audio-recording">Audio Note</label>
                        <audio controls id="audio-recording">
                            {
                                boxData?.soundName ?
                                    <source src={`/sounds/user-sounds/${boxData?.userId}/${boxData?.id}/${boxData?.soundName}.webm`} type="audio/webm" /> :
                                null
                            }
                            Your browser does not support the audio element.
                        </audio>
                        <Flex direction={"row"} justify={"center"}>
                            {
                                isRecording ? <Button color="red" disabled={!boxData} onClick={handleRecording}>Stop Recording</Button> :
                                <Button color="blue" disabled={!boxData} onClick={handleRecording}>Record</Button>
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
                        disabled={!boxData}
                        defaultChecked={boxData?.private}
                        key={form.key('labelPrivacy')}
                        {...form.getInputProps('labelPrivacy')}
                    />
                    {
                        message ? <Alert variant="light" color="red">
                            {message}
                        </Alert> : <></>
                    }
                    <Group justify="flex-end" mt="md">
                        <Button onClick={handleBoxDelete} color="red" loading={addingBox} disabled={!boxData}>Delete Box</Button>
                        <Button type="submit" loading={addingBox} disabled={!boxData}>Apply Changes</Button>
                    </Group>
                </form>
            </>
        }
        </>
    )
}
