import { Text, Title } from "@mantine/core";
import QRCode from "@/components/qrCode";

export default function label({ label }: any) {

    if (!label) {
        return;
    }

    return(
        <>
            <Title order={2}>Label</Title>
            <div
                style={{
                    width: "20rem",
                    height: "20rem",
                    background: "grey"
                }}
            >
                <Title order={3}>{label.title}</Title>
                <Text>{label.type}</Text>
                <QRCode link={process.env.NEXT_PUBLIC_NEXTAUTH_URL + "/label/" + label.id} />
            </div>
        </>
    )
}