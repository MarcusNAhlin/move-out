// // TypeScript types

export enum Role {
    USER = 'USER',
    ADMIN = 'ADMIN',
}

export enum LabelType {
    NORMAL = 'NORMAL',
    FRAGILE = 'FRAGILE',
    HAZARDOUS = 'HAZARDOUS',
}

export interface User {
    id: number;
    email: string;
    hash_pass: string;
    verified: boolean;
    createdAt: Date;
    updatedAt: Date;
    role: Role;
    token?: VerificationToken | null;
    labels: Label[];
}

export interface VerificationToken {
    id: number;
    userId: number;
    token: string;
    createdAt: Date;
    updatedAt: Date;
    expires: Date;
    user: User;
}

export interface Label {
    id: string;
    userId: number;
    title: string;
    type: LabelType;
    text?: string | null;
    picturePath?: string | null;
    soundPath?: string | null;
    createdAt: Date;
    updatedAt: Date;
    user: User;
}
