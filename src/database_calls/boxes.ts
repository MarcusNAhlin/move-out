import prisma from '../../client';

type LabelType = "NORMAL" | "FRAGILE" | "HAZARDOUS";

interface LabelInterface {
    userId: number;
    title: string;
    type: LabelType;
    text?: string;
    imageName?: string;
    soundName?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export async function addBox(label: LabelInterface) {
    try {
        return await prisma.label.create({
            data: label
        });
    } catch (e: any) {
        console.log(e);
        throw new Error(e);
    }
}
