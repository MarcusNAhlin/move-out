import prisma from '../../client';

type LabelType = "NORMAL" | "FRAGILE" | "HAZARDOUS";

interface BoxInterface {
    userId: number;
    title: string;
    type: LabelType;
    text?: string;
    imageName?: string;
    soundName?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export async function addBox(box: BoxInterface) {
    try {
        return await prisma.box.create({
            data: box
        });
    } catch (e: any) {
        console.log(e);
        throw new Error(e);
    }
}
