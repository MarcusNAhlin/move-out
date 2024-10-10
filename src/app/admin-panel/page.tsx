"use client";

import BackBtn from "@/components/BackBtn";
import { User } from "@/lib/types";
import { Button, Loader, Title } from "@mantine/core";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminPanel() {
    const { data: session } = useSession();
    const [loading, isLoading] = useState<boolean>(true);
    const [user, setUser] = useState<User | null>(null);

    const router = useRouter();

    useEffect(() => {
        async function getUser() {
            try {
            const user = await fetch(`/api/account/getUser?email=${session?.user?.email}`, {
                method: "GET",
                headers: {
                "Content-Type": "application/json",
                }});

            const data = await user.json();

            if (data.ok) {
                setUser(data.user);

                return user;
            }

            if (!data.ok) {
                throw new Error(data.message)
            }
            } catch (e) {
            return console.error(e);
            }
        }

        if (!user) {
            getUser();
            isLoading(false);
        }

    }, [session]);

    if (loading) {
        return (<>
            <Loader size={"lg"} />
        </>)
    }

    if (user && user.role !== "ADMIN") {
        router.push("/");
        router.refresh();
    }

    if (user && user.role === "ADMIN") {
        return (<>
            <BackBtn text="&larr;" href={`/`} icon />
            <Title order={1}>Admin Panel</Title>
            <Button
                    component="a"
                    href="/admin-panel/promotion-email"
                    m={"sm"}
                    mt={"sm"}
                    w={"12rem"}
                >Promotion Email
            </Button>
        </>)
    }
}
