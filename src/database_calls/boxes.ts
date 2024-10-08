import prisma from '../../client';

type LabelType = "NORMAL" | "FRAGILE" | "HAZARDOUS";

interface BoxInterface {
    userId: number;
    title: string;
    type: LabelType;
    private: boolean;
    pin?: string;
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

/**
 * Get the owner's email of a box
 *
 * @param string boxId
 * @returns email of the box owner
 */
export async function getBoxOwnerEmail(boxId: string) {
    try {
        const box = await prisma.box.findUnique({
            where: {
                id: boxId
            },
            select: {
                user: {
                    select: {
                        email: true
                    }
                }
            }
        });

        return box?.user.email;
    } catch (e: any) {
        console.log(e);
        throw new Error(e);
    }
}

/**
 * Update box edits to database.
 *
 * @param box
 * @returns box
 */
export async function editBox(box: {
    title?: string | null,
    type?: LabelType | null,
    private: boolean | null,
    pin?: string | null,
    text?: string | null,
    imageName?: string | null,
    soundName?: string | null,
    [key: string]: any
}) {

    const newBoxData: {
        title?: string | undefined,
        type?: LabelType | undefined,
        private: boolean | undefined,
        pin: string | null,
        text?: string | undefined,
        imageName?: string | undefined,
        soundName?: string | undefined,
        [key: string]: any
    } = {
        private: box.private ?? false,
        pin: box.pin ?? null,
    };

    for (const key in box) {
        if (box[key] !== undefined && box[key] !== null) {
            newBoxData[key] = box[key];
        }
    }

    try {
        const res =  await prisma.box.update({
            where: {
                id: box.id
            },
            data: newBoxData
        });

        return res;
    } catch (e: any) {
        console.log(e);
        throw new Error(e);
    }
}
