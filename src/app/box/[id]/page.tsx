"use client";

import { Alert, Box, Button, Flex, Group, Image, Loader, PasswordInput, PinInput, Text, Title } from '@mantine/core';
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react';
import { Box as BoxInterface } from "@/lib/types";
import Label from "@/components/Label";
import BackBtn from '@/components/BackBtn';
import { useSession } from 'next-auth/react';
import { User } from '@/lib/types';
import EditBoxBtn from '@/components/EditBoxBtn';
import { useForm } from '@mantine/form';

export default function BoxPage() {
    const router = useParams();
    const [loading, setLoading] = useState(true);
    const [boxInfo, setBoxInfo] = useState<BoxInterface>();
    const [box, setBox] = useState<BoxInterface>();
    const [message, setMessage] = useState("");

    const [image, setImage] = useState<string | undefined>(undefined);
    const [sound, setSound] = useState<string | undefined>(undefined);

    const [boxOwner, setBoxOwner] = useState<User | null>(null);

    const { data: session } = useSession();

    const { id } = router;

    const [sendingPin, setSendingPin] = useState(false);
    const [pinVerified, setPinVerified] = useState(false);

    const form = useForm({
        mode: 'uncontrolled',
        initialValues: { pinCode: '' },

        validate: {
            pinCode: (value: string) => (value.length < 6 ? 'Pin too short' :
                                value.length > 6 ? 'Pin too long' : null),
        },
    });

    async function handleFormSubmit(values: any) {
        setSendingPin(true);
        console.log(values);

        try {
            const response = await fetch(`/api/box/checkPin`, {
                method: "POST",
                body: JSON.stringify({
                    boxId: id,
                    pinCode: values.pinCode,
                })
            });

            const data = await response.json();

            if (!data.ok) {
                setMessage(data.message);
                setSendingPin(false);
            }

            if (data.ok) {
                setSendingPin(false);
                setPinVerified(true);
                setMessage("");
            }
        } catch (e: any) {
            console.error(e);
            setMessage(e);
        }
    }

    useEffect(() => {
        if (!id) {
            return;
        }

        async function getBoxInfo() {
            try {
                const response = await fetch(`/api/box/get/getSpecificInfo?boxId=${id}`, {
                    method: "GET",
                });

                const data = await response.json();

                setBoxInfo(data.box);

                setLoading(false);
            } catch (e: any) {
                console.error(e);
                setMessage(e);
                setLoading(false);
            }
        }

        getBoxInfo();
    }, [id]);

    useEffect(() => {
        if (!boxInfo) {
            return;
        }

        async function getBoxOwner(boxId: string) {
            try {
                const response = await fetch(`/api/box/get/boxOwner?boxId=${boxId}`, {
                    method: "GET",
                });

                const data = await response.json();

                setBoxOwner(data.boxOwner);

                return data as User;
            } catch (e: any) {
                console.error(e);
                setMessage(e);

                return e;
            }
        }

        getBoxOwner(boxInfo.id);

    }, [boxInfo]);

    useEffect(() => {
        if (!boxOwner) {
            return;
        }

        if (boxOwner.email === session?.user?.email || !boxInfo?.private) {
            setPinVerified(true);
        }

        if (boxOwner.email !== session?.user?.email && boxInfo?.private) {
            setPinVerified(false);
        }

    }, [boxOwner]);

    useEffect(() => {
        async function getBox() {
            try {
                const response = await fetch(`/api/box/get/getSpecific?boxId=${id}`, {
                    method: "GET",
                });

                const data = await response.json();

                setBox(data.box);

                // getBoxOwner(data.box.id);

                setLoading(false);
            } catch (e: any) {
                console.error(e);
                setMessage(e);
                setLoading(false);
            }
        }

        if (pinVerified) {
            getBox();
            setLoading(false);
        }

        if (!pinVerified) {
            setLoading(false);
        }

    }, [pinVerified]);

    useEffect(() => {
        if (!box) {
            return;
        }

        async function getBoxImage() {
            if (image) {
                return;
            }

            try {
                const response = await fetch(`/api/box/get/getFile?boxId=${id}&fileType=image`, {
                    method: "GET",
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch image');
                }
                const data = await response.text()
                setImage(data);
            } catch (e: any) {
                console.error(e);
                setMessage(e);
            }
        }

        async function getBoxSound() {
            if (image) {
                return;
            }

            try {
                const response = await fetch(`/api/box/get/getFile?boxId=${id}&fileType=sound`, {
                    method: "GET",
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch sound');
                }
                const data = await response.text()
                setSound(data);
            } catch (e: any) {
                console.error(e);
                setMessage(e);
            }
        }

        getBoxImage();
        getBoxSound();
    }, [box]);

    let boxText;

    // Split box content into array split by rows
    if (box?.text) {
        boxText = box?.text.split("\n")
    }

    if (loading) {
        return (<>
            <BackBtn text="&larr;" href="/" icon />
            <Loader size={"lg"} />
        </>);
    }


    if (boxInfo?.private && !pinVerified && session?.user?.email !== boxOwner?.email) {
        return (
            <>
                <BackBtn text="&larr;" href="/" icon />
                <Title order={1}>Private Box</Title>
                <form onSubmit={form.onSubmit(handleFormSubmit)}>
                    <PinInput
                        length={6}
                        type="number"
                        aria-label="Pin code for private box"
                        mt={"sm"}
                        key={form.key('pinCode')}
                        {...form.getInputProps('pinCode')}
                    />
                    <Group justify="flex-end" mt="md">
                        <Button type="submit" loading={sendingPin}>Send</Button>
                    </Group>
                </form>
                    {
                        message &&
                        <Alert variant="light" color="red" maw={"300px"} w={"90%"} m={"sm"}>
                            {message}
                        </Alert>
                    }
            </>
        );
    }

    if (session?.user?.email === boxOwner?.email || !boxInfo?.private || pinVerified) {
        return (
            <>
            <BackBtn text="&larr;" href="/" icon />
            {
                box?.title ? <Title order={1}>{box?.title}</Title> : <Title order={1}>Box</Title>
            }

            {
                box?.private && <Title order={3} c="red">Private Box</Title>
            }
            {
                (box?.pin && session?.user?.email === boxOwner?.email) && <>
                <Flex direction={"row"} justify={"center"} align={"center"} pr={"1.5rem"}>
                    <label htmlFor="box-pin">Pin: </label>
                    <PasswordInput
                        display={"inline-block"}
                        id='box-pin'
                        radius="xs"
                        size='md'
                        value={box?.pin}
                        w={"7rem"}
                        m={"sm"}
                    />
                </Flex>
            </>
            }

            {
                message && <Text>{message}</Text>
            }

            <Flex
                direction={"row"}
                justify={"center"}
                align={"center"}
                gap={"md"}
                mt={"lg"}
            >
            {
                boxOwner?.email === session?.user?.email && <EditBoxBtn boxId={box?.id} />
            }
            {
                box && <Label label={box} printBtn hidden />
            }
            </Flex>

            <Box mt={"lg"}>
                <Title order={4}>Box Content</Title>

                <Box
                    style={{
                        border: "2px solid white",
                        borderRadius: "0.2rem",
                        marginTop: "1rem",
                        padding: "1rem",
                    }}
                >
                {
                    boxText && boxText.map((text, index) => {
                        return <Text key={index}>{text}</Text>
                    })
                }
                </Box>
            </Box>
            {
                (image && box?.imageName) && <Image src={image} maw={"90vw"} w={"600px"} mt={"lg"} alt="Box content image" loading='lazy' />
            }
            {
                (sound && box?.soundName) && <>
                <audio controls>
                    <source src={sound} type="audio/webm" />
                    Your browser does not support the audio element.
                </audio>
                </>
            }
            </>
        )
    }
}
