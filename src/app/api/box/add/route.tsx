import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { addBox as addBoxToDB } from "@/database_calls/boxes";
import { LabelType } from "@/lib/types";
import fs from 'fs';
import path from "path";

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
            imageName: image?.name || null,
            soundName: boxSound ? "sound" : null,
        }

        const newLabel = await addBoxToDB(box)

        let imagePath: string | null = null;

        if (image) {
            imagePath = path.join(process.cwd(), "public", "images", "user-images", `${userId}`, `${newLabel.id}`, `${image.name}`);

            try {
                // Convert image to buffer
                const bytes = await image.arrayBuffer();
                const buffer = Buffer.from(bytes);

                // Create directory if it doesn't exist
                await fs.mkdirSync(path.join(process.cwd(), "public", "images", "user-images", `${userId}`, `${newLabel.id}`), { recursive: true });

                // Save image
                await fs.writeFileSync(imagePath, buffer);
            } catch (e) {
                console.log(e);
                return NextResponse.json({ message: "Error saving image!", error: true, status: 401, ok: false }, { status: 401, statusText: "Error saving image!" });
            }
        }

        if (boxSound) {
            const soundPath = path.join(process.cwd(), "public", "sounds", "user-sounds", `${userId}`, `${newLabel.id}`, `sound.webm`);
            try {
                // Convert sound to buffer
                const bytes = await boxSound.arrayBuffer();
                const buffer = Buffer.from(bytes);

                // Create directory if it doesn't exist
                await fs.mkdirSync(path.join(process.cwd(), "public", "sounds", "user-sounds", `${userId}`, `${newLabel.id}`), { recursive: true });

                // Save sound
                await fs.writeFileSync(soundPath, buffer);
            } catch (e) {
                console.log(e);
                return NextResponse.json({ message: "Error saving sound!", error: true, status: 401, ok: false }, { status: 401, statusText: "Error saving sound!" });
            }
        }

        return NextResponse.json({ message: "Box created!", error: false, status: 200, ok: true }, { status: 200, statusText: "Box created!" });
    } catch (e) {
        return NextResponse.json({ message: "Error creating box!", error: true, status: 401, ok: false }, { status: 401, statusText: "Error creating box!" });
    }

    return NextResponse.json({ message: "Error creating box!", error: true, status: 401, ok: false }, { status: 401, statusText: "Error creating box!" });
}

export { addLabel as POST };
