import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { addBox as addBoxToDB } from "@/database_calls/boxes";
import { LabelType } from "@/lib/types";
// import fs from 'fs';
// import path from "path";

import {
    S3Client,
    PutObjectCommand,
} from "@aws-sdk/client-s3";

const Bucket = process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME;
const s3 = new S3Client({
    region: process.env.NEXT_PUBLIC_AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
    },
});

async function addLabel(req: NextRequest) {
    const prisma = new PrismaClient();

    const formData = await req.formData();
    const boxTitle = formData.get("boxTitle") as string;
    const labelDesign = formData.get("labelDesign") as string;
    const boxTextContent = formData.get("boxTextContent") as string;
    const email = formData.get("email") as string;
    const image: File | null = formData.get("boxImage") as File;
    const boxSound: File | null = formData.get("boxSound") as File;
    const boxPrivate: string | boolean = formData.get("boxPrivate") as string;

    let boxPrivateAsBool: boolean = false;
    let randomPin: string | null = null;

    if (boxSound) {
        if (boxSound.size > 10000000 || boxSound.type !== "audio/webm") {
            return NextResponse.json({ message: "Sound too big!", error: true, status: 401, ok: false }, { status: 401, statusText: "Sound too big!" });
        }
    }

    if (image) {
        if (image.size > 10000000) {
            return NextResponse.json({ message: "Image too big!", error: true, status: 401, ok: false }, { status: 401, statusText: "Image too big!" });
        }
    }

    if (boxPrivate) {
        if (boxPrivate === "true") {
            boxPrivateAsBool = true;
            randomPin = Math.floor(100000 + Math.random() * 900000).toString();
        } else {
            boxPrivateAsBool = false;
        }
    }

    if (!boxTitle) {
        return NextResponse.json({ message: "No box title provided!", error: true, status: 401, ok: false }, { status: 401, statusText: "No box title provided!" });
    }

    if (!labelDesign) {
        return NextResponse.json({ message: "No label design provided!", error: true, status: 401, ok: false }, { status: 401, statusText: "No label design provided!" });
    }

    if (!email) {
        return NextResponse.json({ message: "No email provided!", error: true, status: 401, ok: false }, { status: 401, statusText: "No email provided!" });
    }

    let userId: number | null = null;

    try {
        const user = await prisma.user.findUnique({
            where: {
                email: email
            },
            select: {
                id: true
            }
        });

        if (!user?.id) {
            throw new Error("User not found!");
        }

        userId = user.id;
    } catch (e) {
        return NextResponse.json({ message: "User not found!", error: true, status: 401, ok: false }, { status: 401, statusText: "User not found!" });
    }


    try {
        // TODO: Fix type!
        const box: any = {
            userId: userId,
            title: boxTitle,
            type: labelDesign as LabelType,
            private: boxPrivateAsBool,
            text: boxTextContent || null,
            pin: randomPin || null,
            imageName: null,
            soundName: null,
        }

        const newLabel = await addBoxToDB(box)

        let imageFilePath: string | null = null;
        let imageURL: string | null = null;

        if (image) {
            try {
                const bytes = await image.arrayBuffer();
                const buffer = Buffer.from(bytes);

                imageFilePath = `images/${userId}/${newLabel.id}/image.jpg`;

                await s3.send(new PutObjectCommand({ Bucket, Key: imageFilePath, Body: buffer }));

                imageURL = `https://${process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME}.s3.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com/${imageFilePath}`;

            } catch (e) {
                console.log(e);
                return NextResponse.json({ message: "Error saving image!", error: true, status: 401, ok: false }, { status: 401, statusText: "Error saving image!" });
            }
        }

        let soundFilePath: string | null = null;
        let soundURL: string | null = null;

        if (boxSound) {
            try {
                const bytes = await boxSound.arrayBuffer();
                const buffer = Buffer.from(bytes);

                soundFilePath = `sounds/${userId}/${newLabel.id}/sound.webm`;

                await s3.send(new PutObjectCommand({ Bucket, Key: soundFilePath, Body: buffer }));

                soundURL = `https://${process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME}.s3.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com/${soundFilePath}`;
            } catch (e) {
                console.log(e);
                return NextResponse.json({ message: "Error saving sound note!", error: true, status: 401, ok: false }, { status: 401, statusText: "Error saving sound note!" });
            }
        }

        if (imageURL) {
            await prisma.box.update({
                where: {
                    id: newLabel.id
                },
                data: {
                    imageName: imageURL
                }
            });
        }

        if (soundURL) {
            await prisma.box.update({
                where: {
                    id: newLabel.id
                },
                data: {
                    soundName: soundURL
                }
            });
        }

        return NextResponse.json({ message: "Box created!", error: false, status: 200, ok: true }, { status: 200, statusText: "Box created!" });
    } catch (e) {
        return NextResponse.json({ message: "Error creating box!", error: true, status: 401, ok: false }, { status: 401, statusText: "Error creating box!" });
    }

    return NextResponse.json({ message: "Error creating box!", error: true, status: 401, ok: false }, { status: 401, statusText: "Error creating box!" });
}

export { addLabel as POST };
