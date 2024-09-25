import prisma from '../../client';

type LabelType = "NORMAL" | "FRAGILE" | "HAZARDOUS";

interface LabelInterface {
    userId: number;
    title: string;
    type: LabelType;
    text?: string;
    picturePath?: string;
    soundPath?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export async function addLabel(label: LabelInterface) {
    try {
        return await prisma.label.create({
            data: label
        });
    } catch (e: any) {
        throw new Error(e);
    }
}
