"use client"
import { Button, Flex, Skeleton, Text, Title } from "@mantine/core";
import { signIn, useSession } from "next-auth/react";
import LabelHolder from "@/components/LabelHolder";

export default function Home() {
  const { data: session, status } = useSession();

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
                status === "loading" ? <>
                    <Skeleton height={10} width={"15rem"} radius={"md"} mt={"sm"}  />
                    <Skeleton height={35} width={"8rem"} radius={"sm"} m={"auto"} mt={"sm"} mb={"sm"} />
                  </> : null
              }
              {status === "authenticated" ? <Text>Welcome, {session.user?.email}</Text> : null }
              {status === "unauthenticated" ? <Text>You are not logged in</Text> : null }
            {
              status === "authenticated" ?
              <Button
                component="a"
                href="/profile"
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
