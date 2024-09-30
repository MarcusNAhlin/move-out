import { useQRCode } from 'next-qrcode';

export default function QRCode({ link, size }: any) {
    const { Image } = useQRCode();


    return (
        <>
        {
            link &&
            <Image
            text={link}
                options={{
                errorCorrectionLevel: 'M',
                margin: 3,
                scale: 4,
                width: size,
                color: {
                dark: '#000',
                light: '#fff',
                },
            }}
            />
        }

        </>
    )
}