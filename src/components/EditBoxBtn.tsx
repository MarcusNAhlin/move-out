import { Button, Skeleton } from "@mantine/core";
import { IconPencil } from "@tabler/icons-react";

export default function EditBoxBtn({ boxId }: { boxId: string | undefined}) {

    if (!boxId) {
        return <>
            <Skeleton w={"6rem"} height={"1rem"} mt={"lg"} h={"35"} m={"lg"} />
        </>
    }

    return (
        <>
            <Button
                component="a"
                href={`/box/edit/${boxId}`}
                w={"10rem"}
                leftSection={<IconPencil size={28} />}
                style={{

                }}
            >Edit Box</Button>
        </>
    )
}
