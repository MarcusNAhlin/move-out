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
    token?: VerificationToken | undefined;
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
    text?: string | undefined;
    imageName?: string | undefined;
    soundPath?: string | undefined;
    createdAt: Date;
    updatedAt: Date;
    user: User;
}
