"use client";

import { Box, Image, Skeleton, Text, Title } from '@mantine/core';
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react';
import { Box as BoxInterface } from "@/lib/types";
import Label from "@/components/Label";
import BackBtn from '@/components/BackBtn';
import { useSession } from 'next-auth/react';
import { User } from '@/lib/types';
import EditBoxBtn from '@/components/EditBoxBtn';

export default function BoxPage() {
    const router = useParams();
    const [box, setBox] = useState<BoxInterface>();
    const [message, setMessage] = useState("");

    const [boxOwner, setBoxOwner] = useState<User | null>(null);

    const { status, data: session } = useSession();

    const { id } = router;


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


    return (
        <>
        <BackBtn text="&larr;" href="/" icon />
        {
            box?.title ? <Title order={1}>Box - {box?.title}</Title> : <Title order={1}>Box - </Title>
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
