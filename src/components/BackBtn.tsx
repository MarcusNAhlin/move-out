import { Button } from "@mantine/core";

interface BackBtnProps {
    text: string;
    href: string;
    icon?: boolean;
}

export default function BackBtn({ text, href, icon=false }: BackBtnProps) {
    return (
        <>
        {
            icon ?
            <Button
                component="a"
                href={href}
                mt={"lg"}
                style={{
                    position: "absolute",
                    top: "1rem",
                    left: "1rem",
                    fontSize: "1.5rem",
                    fontWeight: "bold"
                }}
                >{text}</Button> :
            <Button
                component="a"
                href={href}
                mt={"lg"}
                style={{
                    position: "absolute",
                    top: "1rem",
                    left: "1rem"
                }}
            >{text}</Button>
        }
        </>
    )
}
