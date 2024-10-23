import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

import {
    S3Client,
    DeleteObjectCommand,
} from "@aws-sdk/client-s3";

const Bucket = process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME;
const s3 = new S3Client({
    region: process.env.NEXT_PUBLIC_AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
    },
});

async function deleteBox(req: NextRequest) {
    const prisma = new PrismaClient();

    const boxId: string | null = req.nextUrl.searchParams.get("boxId") as string;

    if (!boxId) {
        return NextResponse.json({ message: "No boxId provided!", error: true, status: 401, ok: false });
    }

    try {
        const box = await prisma.box.findUnique({
            where: {
                id: boxId
            }
        });

        if (box?.imageName) {
            await s3.send(new DeleteObjectCommand ({
                Bucket: Bucket,
                Key: box.imageName,
            }));
        }

        if (box?.soundName) {
            await s3.send(new DeleteObjectCommand ({
                Bucket: Bucket,
                Key: box.soundName,
            }));
        }

        await prisma.box.delete({
            where: {
                id: boxId
            }
        });

        return NextResponse.json({ message: "Box deleted!", error: false, status: 200, ok: true });
    } catch (e) {
        return NextResponse.json({ message: "Box couldn't be deleted!", error: true, status: 401, ok: false });
    }
}

export { deleteBox as DELETE };
