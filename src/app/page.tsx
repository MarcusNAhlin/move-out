"use client"
import { Button, Flex, Skeleton, Text, Title } from "@mantine/core";
import { signIn, useSession } from "next-auth/react";
import LabelHolder from "@/components/LabelHolder";
import { useEffect, useState } from "react";
import { User } from "@/lib/types";
import { redirect } from 'next/navigation';

export default function Home() {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const [loading, isLoading] = useState<boolean>(true);

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
          isLoading(false);

          return user;
        }

        if (!data.ok) {
          throw new Error(data.message)
        }
      } catch (e) {
        isLoading(false);
        return console.error(e);
      }
    }

    if (!user) {
      getUser();
    }

  }, [session]);

  useEffect(() => {
    // If the user is not authenticated (logged in), redirect to the welcome page
    if (!loading && status === "unauthenticated") {
      redirect("/welcome");
    }
  }, [loading]);


  return (
    <>
      <main
        style={{
          height: "100vh",
          width: "100vw",
        }}>
        <Flex
          justify="center"
          style={{
            width: "100%",
          }}
        >
          <div
          style={{
            textAlign: "center",
          }}>
            <Title order={1}>MoveOut</Title>
              {
                loading ? <>
                    <Skeleton height={10} width={"15rem"} radius={"md"} mt={"sm"}  />
                    <Skeleton height={35} width={"8rem"} radius={"sm"} m={"auto"} mt={"sm"} mb={"sm"} />
                  </> : null
              }
              {status === "authenticated" ? <Text>Welcome, {session.user?.email}</Text> : null }
              {status === "unauthenticated" ? <Text>You are not logged in</Text> : null }
            {
              user?.role === "ADMIN" && <>
                <Button
                  component="a"
                  href="/admin-panel"
                  m={"sm"}
                  mt={"sm"}
                  w={"8rem"}
                  color="orange"
                >Admin Panel</Button>
              </>
            }
            {
              status === "authenticated" ?
              <Button
                component="a"
                href="/profile"
                m={"sm"}
                mt={"sm"}
                w={"8rem"}
              >Visit Profile</Button> : null
            }
            {
              status === "unauthenticated" ?
              <Button mt={"sm"} w={"8rem"} onClick={() => signIn()}>Sign In</Button> : null
            }
          </div>
        </Flex>
        <LabelHolder status={status} />
      </main>
    </>
  );
}
