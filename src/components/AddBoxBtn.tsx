import { Button } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";

export default function addBoxBtn() {

    return (
        <>
            <Button
                variant="filled"
                radius="xl"
                size="compact-md"
                component="a"
                href="/box/add"
                leftSection={<IconPlus size={28} />}
            >Add Box</Button>
        </>
    )
}
