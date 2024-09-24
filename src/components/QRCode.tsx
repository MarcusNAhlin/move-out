import { useQRCode } from 'next-qrcode';

export default function qrCode({ link }: any) {
    const { SVG } = useQRCode();


    return (
        <>
        {
            link &&
            <SVG
            text={link}
                options={{
                errorCorrectionLevel: 'M',
                margin: 3,
                scale: 4,
                width: 200,
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