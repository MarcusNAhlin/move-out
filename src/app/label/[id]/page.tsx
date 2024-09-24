"use client";

import { Text } from '@mantine/core';
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react';
import Label from "@/components/Label";

interface Label {
    id: string;
    title: string;
    type: string
}

export default function labelPage() {
    const router = useParams();
    const [label, setLabel] = useState<Label>();
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
    }, []);


    return (
        <>
        {
            message && <Text>{message}</Text>
        }

        {
            label && <Label label={label} />
        }
        </>
    )
}