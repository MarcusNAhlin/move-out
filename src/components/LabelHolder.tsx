import { Flex, Image, Skeleton, Title } from "@mantine/core";
import AddBoxBtn from "@/components/AddBoxBtn";
import UserBoxes from "@/components/UserBoxes";

export default function labelHolder({ status }: { status: string }) {

    if (status === "loading") {
        return (
            <>
                <Flex p={"lg"} bg={"gray"} mt={"lg"} direction={"column"} align={"flex-start"} mih={"70vh"}>
                    <Flex  align={"center"} gap={"sm"}>
                        <Title order={2}>Labels</Title>
                        <AddBoxBtn />
                    </Flex>
                    <Flex gap={"lg"} mt={"lg"} wrap={"wrap"} w={"100%"} justify={"center"}>
                        <Skeleton width={"15rem"} height={"20rem"} />
                        <Skeleton width={"15rem"} height={"20rem"} />
                        <Skeleton width={"15rem"} height={"20rem"} />
                        <Skeleton width={"15rem"} height={"20rem"} />
                        <Skeleton width={"15rem"} height={"20rem"} />
                    </Flex>
                </Flex>
            </>
        )
    }

    if (status === "authenticated") {
        return (
            <>
            <Flex p={"lg"} bg={"gray"} mt={"lg"} direction={"column"} align={"flex-start"} mih={"100vh"}>
                <Flex  align={"center"} gap={"sm"} style={{ zIndex: "2" }}>
                    <Title order={2}>Labels</Title>
                    <AddBoxBtn />
                </Flex>
                <UserBoxes />
            <Image
                src={"/boxes_long.png"}
                style={{
                    position: "absolute",
                    zIndex: "1",
                    filter: "brightness(0.5)",
                    minHeight: "30vh",
                    width: "100vw",
                    left: "0"
                }}
            />
            </Flex>
            </>
        )
    }

    if (status === "unauthenticated") {
        return (
            <>
            <Flex p={"lg"} bg={"gray"} mt={"lg"} direction={"column"} align={"flex-start"} mih={"70vh"}>
                <Flex  align={"center"} gap={"sm"}>
                    <Title order={2}>Labels</Title>
                    <AddBoxBtn />
                </Flex>
            </Flex>
            </>
        )
    }
}
