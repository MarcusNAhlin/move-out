import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { addLabel as addLabelToDB } from "@/database_calls/labels";
import { LabelType } from "@/lib/types";
import fs from 'fs';
import path from "path";

interface Image {
    size: number;
    type: string;
    name: string;
    lastModified: number;
}

export const config = {
    api: {
      bodyParser: false,
    },
  };

async function addLabel(req: NextRequest) {
    const prisma = new PrismaClient();
    // const { labelTitle, labelDesign, labelTextContent, email, labelImage }:
    //     { labelTitle: string, labelDesign: string, labelTextContent:string,  email: string, labelImage: any } = await req.json();

    const formData = await req.formData();
    const image: any | null = formData.get("labelImage") as any;
    const labelTitle = formData.get("labelTitle") as string;
    const labelDesign = formData.get("labelDesign") as string;
    const labelTextContent = formData.get("labelTextContent") as string;
    const email = formData.get("email") as string;

    console.log(formData);

    if (image) {
        if (image.size > 10000000) {
            return NextResponse.json({ message: "Image too big!", error: true, status: 401, ok: false }, { status: 401 });
        }
    }

    if (!labelTitle) {
        return NextResponse.json({ message: "No label title provided!", error: true, status: 401, ok: false }, { status: 401 });
    }

    if (!labelDesign) {
        return NextResponse.json({ message: "No label design provided!", error: true, status: 401, ok: false }, { status: 401 });
    }

    if (!email) {
        return NextResponse.json({ message: "No email provided!", error: true, status: 401, ok: false }, { status: 401 });
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
        return NextResponse.json({ message: "User not found!", error: true, status: 401, ok: false }, { status: 401 });
    }


    try {
        // TODO: Fix type!
        const label: any = {
            userId: userId,
            title: labelTitle,
            type: labelDesign as LabelType,
            text: labelTextContent || "",
            imageName: image.name || null
        }

        const newLabel = await addLabelToDB(label)

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
                return NextResponse.json({ message: "Error saving image!", error: true, status: 401, ok: false }, { status: 401 });
            }
        }

        return NextResponse.json({ message: "Label created!", error: false, status: 200, ok: true }, { status: 200 });
    } catch (e) {
        return NextResponse.json({ message: "Error creating label!", error: true, status: 401, ok: false }, { status: 401 });
    }

    return NextResponse.json({ message: "Error creating label!", error: true, status: 401, ok: false }, { status: 401 });
}

export { addLabel as POST };
