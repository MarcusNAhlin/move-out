import { Button, Skeleton } from "@mantine/core";

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
                mt={"lg"}
                m={"lg"}
                w={"6rem"}
                style={{

                }}
            >Edit Box</Button>
        </>
    )
}
