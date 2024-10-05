"use client";

import { Box, Image, Text, Title } from '@mantine/core';
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react';
import { Box as BoxInterface } from "@/lib/types";
import Label from "@/components/Label";
import BackBtn from '@/components/BackBtn';

export default function BoxPage() {
    const router = useParams();
    const [box, setBox] = useState<BoxInterface>();
    const [message, setMessage] = useState("");


    const { id } = router;


    useEffect(() => {
        async function getBox() {
            try {
                const response = await fetch(`/api/box/get/getSpecific?boxId=${id}`, {
                    method: "GET",
                });

                const data = await response.json();

                setBox(data.box);
            } catch (e: any) {
                console.error(e);
                setMessage(e);
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
            message && <Text>{message}</Text>
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
