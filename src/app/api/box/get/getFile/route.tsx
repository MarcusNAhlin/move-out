import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

import {
    S3Client,
    GetObjectCommand
} from "@aws-sdk/client-s3";
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export const revalidate = 0;

const s3 = new S3Client({
    region: process.env.NEXT_PUBLIC_AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
    },
});

async function getFile(req: NextRequest) {
    const prisma = new PrismaClient();

    const boxId: string | null = req.nextUrl.searchParams.get("boxId") as string;
    const fileType: string | null = req.nextUrl.searchParams.get("fileType") as string;

    if (!boxId) {
        return NextResponse.json({ message: "No box provided!", error: true, status: 401, ok: false });
    }

    if (!fileType) {
        return NextResponse.json({ message: "No file type provided!", error: true, status: 401, ok: false });
    }

    if (![ "image", "sound" ].includes(fileType)) {
        return NextResponse.json({ message: "Invalid file type provided!", error: true, status: 401, ok: false });
    }

    try {
        const box = await prisma.box.findUnique({
            where: {
                id: boxId,
            },
            select: {
                id: true,
                userId: true,
                imageName: true,
                soundName: true
            }
        });

        if (!box) {
            return NextResponse.json({ message: "No box found!", error: true, status: 401, ok: false });
        }

        if (fileType === "image") {
            try {
                const command = new GetObjectCommand({
                    Bucket: process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME,
                    Key: `images/${box.userId}/${box.id}/image.jpg`,
                });

                const url = await getSignedUrl(s3, command);

                return new NextResponse(url)
            } catch (error) {
                console.error('Error fetching image from S3:', error);
                return new Response('Error fetching image from S3');
            }
        }

        if (fileType === "sound") {
            try {
                const command = new GetObjectCommand({
                    Bucket: process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME,
                    Key: `sounds/${box.userId}/${box.id}/sound.webm`,
                });

                const url = await getSignedUrl(s3, command);

                return new NextResponse(url)
                // return NextResponse.json({ message: "File found!", error: false, status: 200, ok: true, URL: url });
            } catch (error) {
                console.error('Error fetching sound from S3:', error);
                return new Response('Error fetching sound from S3');
            }
        }

    } catch (e) {
        return NextResponse.json({ message: "Error finding file!", error: true, status: 401, ok: false });
    }

    return NextResponse.json({ message: "Error finding file!", error: true, status: 401, ok: false });
}

export { getFile as GET };
