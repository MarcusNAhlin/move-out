import BackBtn from "@/components/BackBtn";
import { Button } from "@mantine/core";

export default function verifyInfo() {
    return (
        <>
            <BackBtn text="&larr;" href="/" icon />
            <h1>Verification</h1>
            <p>Your email needs to be verified to login. Visit your email inbox for more information.</p>
        </>
    )
}
