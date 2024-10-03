"use client"
import { Button, Flex, Text, Title } from "@mantine/core";
import { signIn, signOut, useSession } from "next-auth/react";
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
            <Title order={1} mb={"md"}>MoveOut</Title>
            <Text
              mb={"sm"}
            >
              {status === "authenticated" ? `Welcome, ${session.user?.email}` : "You are not signed in"}
            </Text>
            {
              status === "authenticated" ?
              // <Button onClick={() => signOut()}>Sign Out</Button>
              <Button
                component="a"
                href="/profile"
              >Visit Profile</Button>
              :
              <Button onClick={() => signIn()}>Sign In</Button>
            }
          </div>
        </Flex>
        {
          status === "authenticated" &&
          <LabelHolder />
        }
      </main>
    </>
  );
}
