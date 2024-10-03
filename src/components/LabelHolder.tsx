import { Flex, Skeleton, Title } from "@mantine/core";
import AddLabelBtn from "@/components/AddLabelBtn";
import UserLabels from "@/components/UserLabels";

export default function labelHolder({ status }: { status: string }) {

    if (status === "loading") {
        return (
            <>
                <Flex p={"lg"} bg={"gray"} mt={"lg"} direction={"column"} align={"flex-start"} mih={"70vh"}>
                    <Flex  align={"center"} gap={"sm"}>
                        <Title order={2}>Labels</Title>
                        <AddLabelBtn />
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
            <Flex p={"lg"} bg={"gray"} mt={"lg"} direction={"column"} align={"flex-start"} mih={"70vh"}>
                <Flex  align={"center"} gap={"sm"}>
                    <Title order={2}>Labels</Title>
                    <AddLabelBtn />
                </Flex>
                <UserLabels />
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
                    <AddLabelBtn />
                </Flex>
            </Flex>
            </>
        )
    }
}
