"use client";

import { Alert, Box, Button, Flex, Group, Image, PasswordInput, PinInput, Text, Title } from '@mantine/core';
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
    const [box, setBox] = useState<BoxInterface>();
    const [message, setMessage] = useState("");

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
        async function getBox() {
            try {
                const response = await fetch(`/api/box/get/getSpecific?boxId=${id}`, {
                    method: "GET",
                });

                const data = await response.json();

                setBox(data.box);

                getBoxOwner(data.box.id);
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

                setBoxOwner(data.boxOwner);

                return data as User;
            } catch (e: any) {
                console.error(e);
                setMessage(e);

                return e;
            }
        }

        getBox();
    }, [id]);

    let boxText;

    // Split box content into array split by rows
    if (box?.text) {
        boxText = box?.text.split("\n")
    }


    if (box?.private && !pinVerified) {
        if (session?.user?.email !== boxOwner?.email) {
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
    }

    if (pinVerified || !box?.private || session?.user?.email === boxOwner?.email) {
        return (
            <>
            <BackBtn text="&larr;" href="/" icon />
            {
                box?.title ? <Title order={1}>Box - {box?.title}</Title> : <Title order={1}>Box - </Title>
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

            {
                boxOwner?.email === session?.user?.email && <EditBoxBtn boxId={box?.id} />
            }
            {
                box && <Label label={box} printBtn />
            }

            <Box mt={"lg"}>
                <Title order={4}>Box Content</Title>


                {
                    boxText && boxText.map((text, index) => {
                        return <Text key={index}>{text}</Text>
                    })
                }
            </Box>
            {
                box?.imageName && <Image src={`/images/user-images/${box?.userId}/${box?.id}/${box?.imageName}`} maw={"90vw"} w={"600px"} mt={"lg"} alt="Box content image" />
            }
            {
                box?.soundName && <>
                <audio controls>
                    <source src={`/sounds/user-sounds/${box?.userId}/${box?.id}/${box.soundName}.webm`} type="audio/webm" />
                    Your browser does not support the audio element.
                </audio>
                </>
            }
            </>
        )
    }
}
