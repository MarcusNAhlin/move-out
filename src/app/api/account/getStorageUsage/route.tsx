import { NextRequest, NextResponse } from 'next/server';
import { getBoxesFromUserId } from '@/database_calls/boxes';

import {
    S3Client,
    HeadObjectCommand,
} from "@aws-sdk/client-s3";

const Bucket = process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME;
const s3 = new S3Client({
    region: process.env.NEXT_PUBLIC_AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
    },
});

export const revalidate = 0;

async function getStorageUsage(req: NextRequest) {
    let id: string | number | null = req.nextUrl.searchParams.get("id") as string;

    id = Number(id);

    if (!id) {
        return NextResponse.json({ message: "Can't find id!", error: true, status: 401, ok: false }, { status: 401, statusText: "Can't find id!"});
    }

    const images = [];
    const sounds = [];
    const baseUrl = `https://${process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME}.s3.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com/`;
    let storageUsage: number | undefined = undefined;
    let boxes;

    try {
        boxes = await getBoxesFromUserId(id);

        if (!boxes) {
            return NextResponse.json({ message: "No boxes found for user!", error: true, status: 401, ok: false });
        }
    } catch(e) {
        console.error(e);
        return NextResponse.json({ message: "Error finding boxes for user!", error: true, status: 401, ok: false });
    }

    for (const box of boxes) {
        try {
            if (box.imageName) {
                const imageName = box.imageName.replace(baseUrl, '');
                images.push(imageName);
            }

            if (box.soundName) {
                const soundName = box.soundName.replace(baseUrl, '');
                sounds.push(soundName);
            }
        } catch (e) {
            console.error(e);
        }
    }

    for (const image of images) {
        try {
            const params = {
                Bucket: Bucket,
                Key: image
            };

            const storageUsageImages = await s3.send(new HeadObjectCommand(params))

            if (storageUsageImages.ContentLength) {
                storageUsage === undefined && (storageUsage = 0);
                storageUsage += Number(storageUsageImages.ContentLength);
            }

        } catch (error) {
            console.error(error);
        }
    }

    for (const sound of sounds) {
        try {
            const params = {
                Bucket: Bucket,
                Key: sound
            };

            const storageUsageSounds = await s3.send(new HeadObjectCommand(params))

            if (storageUsageSounds.ContentLength) {
                storageUsage === undefined && (storageUsage = 0);
                storageUsage += Number(storageUsageSounds.ContentLength);
            }
        } catch (error) {
            console.error(error);
        }
    }

    if (!storageUsage) {
        return NextResponse.json({ message: "No storage usage found!", error: true, status: 401, ok: false });
    }

    return NextResponse.json({ message: "Storage usage found!", error: false, status: 200, ok: true, storageUsage: storageUsage });
}

export { getStorageUsage as GET };

