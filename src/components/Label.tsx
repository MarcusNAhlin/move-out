import { Button, Text, Title } from "@mantine/core";
import QRCode from "@/components/QRCode";
import BackBtn from "@/components/BackBtn";

export default function label({ label, width="20rem", printBtn=false }: any) {

    if (!label) {
        return;
    }

    let color: string;
    let icon: string;

    switch (label.type) {
        case "NORMAL":
            color = "grey"
            icon = "☐"
            break;

        case "FRAGILE":
            color = "orange"
            icon = "⚠"
            break;

        case "HAZARDOUS":
            color = "red"
            icon = "☣"
            break;

        default:
            color = "grey"
            icon = "☐"
            break;
    }

    function printLabel() {
        const divContents = document.getElementById("label");

        if (divContents) {
            const divContentHTML = divContents.innerHTML;

            const printWindow = window.open('', '', 'height=500, width=500');

            if (printWindow) {
                printWindow.document.open();
                printWindow.document.write(`
                <html>
                <head>
                <style>
                    body {
                        text-align: center;
                    }
            </style>
                <title>Label</title>
                </head>
                    <body>
                        ${divContentHTML}
                    </body>
                </html>
                `);

                printWindow.document.close();
                printWindow.print();
            }
        }
    }

    return(
        <>
            <BackBtn text="&larr;" href="/" icon />
            <div
                style={{
                    width: width,
                    border: `8px solid ${color}`,
                    background: "white"
                }}
                id="label"
            >
                <Title order={3}
                    style={{
                        color: "black",
                        fontSize: "1.6rem",
                    }}
                    id="label-title"
                >{label.title}</Title>
                <Text
                    style={{
                        color: color,
                        textDecoration: "underline",
                        fontWeight: "bold",
                        fontSize: "2rem"
                    }}
                >{label.type}</Text>
                <Text
                    style={{
                        color: color,
                        fontWeight: "bold",
                        fontSize: "4rem"
                    }}
                >{icon}</Text>
                <QRCode link={process.env.NEXT_PUBLIC_NEXTAUTH_URL + "/label/" + label.id} size={width/2} />
            </div>
            {
                printBtn &&
                <Button onClick={printLabel} mt={"sm"}>Print</Button>
            }
        </>
    )
}