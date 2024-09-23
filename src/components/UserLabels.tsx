"use client"

import { Card, Flex, Text } from "@mantine/core";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

interface Label {
    id: number;
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
                    <Card key={label.id} mih={"15rem"} miw={"10rem"}>
                        <Text>{label.title}</Text>
                    </Card>
                )
            }
        ) : null
        }
        </Flex>
        </>
    )
}