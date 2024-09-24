"use client"

import { Button, Card, Flex, Text } from "@mantine/core";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Label from "@/components/Label";

interface Label {
    id: string;
    title: string;
}

export default function userLabels() {
    const { data: session, status } = useSession();
    const [labels, setLabels] = useState<Label[]>([]);

        useEffect(() => {
            async function getUserLabels() {
                if (!session?.user?.email) {
                    return;
                }

                try {
                    const data = await fetch(`/api/label/get?email=${session.user.email}`, {
                        method: "GET",
                    });

                    const response = await data.json();
                    setLabels(response.labels);

                } catch (e: any) {
                    console.error(e);
                }
            }

        getUserLabels();
    }, []);

    return (
        <>
        <Flex gap={"lg"} mt={"lg"} wrap={"wrap"} w={"100%"} justify={"center"}>
        {
            labels ? labels.map((label) => {
                return (
                    <a href={`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/label/${label.id}`}>
                        <Label label={label} width="15rem" />
                    </a>
                )
            }
        ) : null
        }
        </Flex>
        </>
    )
}