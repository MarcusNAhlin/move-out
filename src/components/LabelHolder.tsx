import { Flex, Title } from "@mantine/core";
import AddLabelBtn from "@/components/addLabelBtn";
import UserLabels from "@/components/UserLabels";

export default function labelHolder() {

    return (
        <>
        <Flex p={"lg"} bg={"gray"} mt={"lg"} direction={"column"} align={"flex-start"}>
            <Flex  align={"center"} gap={"sm"}>
                <Title order={2}>Labels</Title>
                <AddLabelBtn />
            </Flex>
            <UserLabels />
        </Flex>
        </>
    )
}
