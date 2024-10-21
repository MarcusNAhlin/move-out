import { Button, Divider, Flex, Image, Text, Title } from "@mantine/core";

export default function welcomePage() {

    return (
    <>
        <Title order={1}>Welcome to MoveOut!</Title>
        <Text>Keep track of your moving boxes!</Text>
        <Flex
            direction={"column"}
            align={"center"}
            m={"md"}
        >
            <Button
                component="a"
                href="/login"
                w={"8rem"}
            >
                Login
            </Button>
            <Text
                m={"0.25rem"}
            >or</Text>
            <Button
                component="a"
                href="/register"
                w={"8rem"}
            >
                Register
            </Button>
        </Flex>
        <Image
            style={{
                position: "absolute",
                top: "0",
                left: "0",
                zIndex: "-1",
                filter: "brightness(0.25)",
                minHeight: "500px"
            }}
            src={"/house-moving-illustration.png"}
        ></Image>
    </>
    )
}
