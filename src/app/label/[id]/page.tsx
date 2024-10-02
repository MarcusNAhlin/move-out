"use client";

import { Box, Image, Text, Title } from '@mantine/core';
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react';
import { Label as LabelInterface } from "@/lib/types";
import Label from "@/components/Label";

export default function LabelPage() {
    const router = useParams();
    const [label, setLabel] = useState<LabelInterface>();
    const [message, setMessage] = useState("");


    const { id } = router;


    useEffect(() => {
        async function getLabel() {
            try {
                const response = await fetch(`/api/label/get/getSpecific?labelId=${id}`, {
                    method: "GET",
                });

                const data = await response.json();

                setLabel(data.label);
            } catch (e: any) {
                console.error(e);
                setMessage(e);
            }
        }

        getLabel();
    }, [id]);

    let labelText;

    // Split box content into array split by rows
    if (label?.text) {
        labelText = label?.text.split("\n")
    }


    return (
        <>
        {
            message && <Text>{message}</Text>
        }

        {
            label && <Label label={label} printBtn />
        }
        <Box mt={"lg"}>
            <Title order={4}>Box Content</Title>

            {
                labelText && labelText.map((text, index) => {
                    return <Text key={index}>{text}</Text>
                })
            }
        </Box>
        {
            label?.imageName && <Image src={`/images/user-images/${label?.userId}/${label?.id}/${label?.imageName}`} maw={"90vw"} w={"600px"} mt={"lg"} alt="Box content image" />
        }
        {
            label?.soundName && <>
            <audio controls>
                <source src={`/sounds/user-sounds/${label?.userId}/${label?.id}/${label.soundName}`} type="audio/webm" />
                Your browser does not support the audio element.
            </audio>
            </>
        }
        </>
    )
}
