import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { editBox as editBoxToDB } from "@/database_calls/boxes";
import { LabelType } from "@/lib/types";
import fs from 'fs';
import path from "path";

export const config = {
    api: {
        bodyParser: false,
    },
};

async function editBox(req: NextRequest) {
    const prisma = new PrismaClient();

    const formData = await req.formData();
    const id = formData.get("id") as string;
    const boxTitle = formData.get("boxTitle") as string;
    const labelDesign = formData.get("labelDesign") as string;
    const boxTextContent = formData.get("boxTextContent") as string;
    const email = formData.get("email") as string;
    const image: File | null = formData.get("boxImage") as File;
    const boxSound: File | null = formData.get("boxSound") as File;
    const boxPrivate: string | boolean = formData.get("boxPrivate") as string;

    let boxPrivateAsBool: boolean = false;
    let randomPin: string | null = null;

    if (!id) {
        return NextResponse.json({ message: "No box id provided!", error: true, status: 401, ok: false }, { status: 401, statusText: "No box id provided!" });
    }

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

    if (!email) {
        return NextResponse.json({ message: "No email provided!", error: true, status: 401, ok: false }, { status: 401, statusText: "No email provided!" });
    }

    if (boxPrivate) {
        if (boxPrivate === "true") {
            boxPrivateAsBool = true;
            randomPin = Math.floor(100000 + Math.random() * 900000).toString();
        } else {
            boxPrivateAsBool = false;
        }
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
            id: id,
            userId: userId,
            title: boxTitle || null,
            type: labelDesign as LabelType || null,
            private: boxPrivateAsBool,
            pin: randomPin || null,
            text: boxTextContent || null,
            imageName: image?.name || null,
            soundName: boxSound ? "sound" : null,
        }

        const editedBox = await editBoxToDB(box)

        let imagePath: string | null = null;

        if (image) {
            imagePath = path.join(process.cwd(), "public", "images", "user-images", `${userId}`, `${editedBox.id}`, `${image.name}`);

            try {
                fs.rmSync(`public/images/user-images/${userId}`, { recursive: true, force: true });

                // Convert image to buffer
                const bytes = await image.arrayBuffer();
                const buffer = Buffer.from(bytes);

                // Create directory if it doesn't exist
                await fs.mkdirSync(path.join(process.cwd(), "public", "images", "user-images", `${userId}`, `${editedBox.id}`), { recursive: true });

                // Save image
                await fs.writeFileSync(imagePath, buffer);
            } catch (e) {
                console.log(e);
                return NextResponse.json({ message: "Error saving image!", error: true, status: 401, ok: false }, { status: 401, statusText: "Error saving image!" });
            }
        }

        if (boxSound) {
            const soundPath = path.join(process.cwd(), "public", "sounds", "user-sounds", `${userId}`, `${editedBox.id}`, `sound.webm`);
            try {
                fs.rmSync(`public/sounds/user-sounds/${userId}`, { recursive: true, force: true });
                // Convert sound to buffer
                const bytes = await boxSound.arrayBuffer();
                const buffer = Buffer.from(bytes);

                // Create directory if it doesn't exist
                await fs.mkdirSync(path.join(process.cwd(), "public", "sounds", "user-sounds", `${userId}`, `${editedBox.id}`), { recursive: true });

                // Save sound
                await fs.writeFileSync(soundPath, buffer);
            } catch (e) {
                console.log(e);
                return NextResponse.json({ message: "Error saving sound!", error: true, status: 401, ok: false }, { status: 401, statusText: "Error saving sound!" });
            }
        }

        return NextResponse.json({ message: "Box edited!", error: false, status: 200, ok: true }, { status: 200, statusText: "Box edited!" });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ message: "Error editing box!", error: true, status: 401, ok: false }, { status: 401, statusText: "Error editing box!" });
    }

    return NextResponse.json({ message: "Error editing box!", error: true, status: 401, ok: false }, { status: 401, statusText: "Error editing box!" });
}

export { editBox as POST };
