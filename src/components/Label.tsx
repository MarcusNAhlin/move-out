import { Text, Title } from "@mantine/core";
import QRCode from "@/components/QRCode";

export default function label({ label }: any) {

    if (!label) {
        return;
    }

    let color: string;

    switch (label.type) {
        case "NORMAL":
            color = "grey"
            break;

        case "FRAGILE":
            color = "orange"
            break;

        case "HAZARDOUS":
            color = "red"
            break;

        default:
            color = "grey"
            break;
    }

    return(
        <>
            <Title order={2}>Label</Title>
            <div
                style={{
                    width: "20rem",
                    height: "20rem",
                    border: `8px solid ${color}`,
                    background: "white"
                }}
            >
                <Title order={3}
                    style={{
                        color: "black",
                        fontSize: "1.6rem"
                    }}
                >{label.title}</Title>
                <Text
                    style={{
                        color: color,
                        textDecoration: "underline",
                        fontWeight: "bold",
                        fontSize: "2rem"
                    }}
                >{label.type}</Text>
                <QRCode link={process.env.NEXT_PUBLIC_NEXTAUTH_URL + "/label/" + label.id} />
            </div>
        </>
    )
}