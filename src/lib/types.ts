// TypeScript types


export type LabelType = "NORMAL" | "FRAGILE" | "HAZARDOUS";

export interface LabelInterface {
    userId: number;
    title: string;
    type: LabelType;
    text?: string;
    picturePath?: string;
    soundPath?: string;
    createdAt?: Date;
    updatedAt?: Date;
}