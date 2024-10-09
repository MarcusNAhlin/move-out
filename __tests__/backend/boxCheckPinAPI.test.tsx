import { NextRequest, NextResponse } from 'next/server';
import { POST } from '../../src/app/api/box/checkPin/route';
import { prismaMock } from "../../singleton";
import { LabelType, Role, User } from '@/lib/types';

type Box = {
    id: string;
    userId: number;
    title: string;
    type: LabelType;
    private: boolean;
    pin: string | null;
    text: string | null;
    imageName: string | null;
    soundName: string | null;
    createdAt: Date;
    updatedAt: Date;
    user: {
        id: number;
        email: string;
        hash_pass: string;
        verified: boolean;
        createdAt: Date;
        updatedAt: Date;
        role: Role;
        labels: Box[];
    };
};

// Mock NextResponse
jest.mock('next/server', () => ({
    NextResponse: {
        json: jest.fn().mockImplementation((data) => ({
            ...data,
            status: 200,
        })),
    },
}));

describe('Box checkPin API test', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('returns an error if boxId is missing', async () => {
        const req = {
            json: jest.fn().mockResolvedValue({
                pinCode: "123456"
            }),
        } as unknown as NextRequest;

        const res = {} as NextResponse;

        const response = await POST(req);

        expect(NextResponse.json).toHaveBeenCalledWith({
            message: "No box provided!",
            error: true,
            status: 401,
            ok: false,
        });
    });

    it('returns an error if pinCode is missing', async () => {
        const req = {
            json: jest.fn().mockResolvedValue({
                boxId: "test-id-123"
            }),
        } as unknown as NextRequest;

        const res = {} as NextResponse;

        const response = await POST(req);

        expect(NextResponse.json).toHaveBeenCalledWith({
            message: "No pin provided!",
            error: true,
            status: 401,
            ok: false,
        });
    });

    it('returns an error if box is missing in database', async () => {
        const req = {
            json: jest.fn().mockResolvedValue({
                boxId: "test-id-123",
                pinCode: "123456"
            }),
        } as unknown as NextRequest;

        const createdAt = new Date();
        const updatedAt = new Date();

        prismaMock.box.findUnique.mockResolvedValue(null);

        const res = {} as NextResponse;

        const response = await POST(req);

        expect(NextResponse.json).toHaveBeenCalledWith({
            message: "Can't find box!",
            error: true,
            status: 401,
            ok: false,
        });
    });

    it.skip('returns an error if provided pin is wrong', async () => {
        const req = {
            json: jest.fn().mockResolvedValue({
                boxId: "test-id-123",
                pinCode: "123456"
            }),
        } as unknown as NextRequest;

        const box: Box = {
            id: "test-id-123",
            userId: 1,
            title: "test box",
            private: true,
            pin: "654321",
            text: "",
            type: "NORMAL" as LabelType,
            imageName: "",
            soundName: "",
            createdAt: new Date(),
            updatedAt: new Date(),
            user: {
                id: 1,
                email: "test@gmail.com",
                hash_pass: "test",
                verified: true,
                createdAt: new Date(),
                updatedAt: new Date(),
                role: "USER" as Role,
                labels: [] as Box[],
            }
        }

        prismaMock.box.findUnique.mockResolvedValue(box);

        await POST(req);

        expect(NextResponse.json).toHaveBeenCalledWith({
            message: "Pin incorrect!",
            error: true,
            status: 401,
            ok: false,
        });
    });

    it.skip('returns success if provided pin is correct', async () => {
        const req = {
            json: jest.fn().mockResolvedValue({
                boxId: "test-id-123",
                pinCode: "123456"
            }),
        } as unknown as NextRequest;

        const user: User = {
            id: 1,
            email: "test@gmail.com",
            hash_pass: "test",
            verified: true,
            createdAt: new Date(),
            updatedAt: new Date(),
            role: "USER" as Role,
            labels: [] as Box[],
        }

        prismaMock.user.create.mockResolvedValue(user);

        const box: Box = {
            id: "test-id-123",
            userId: 1,
            title: "test box",
            private: true,
            pin: "123456",
            text: "",
            type: "NORMAL" as LabelType,
            imageName: "",
            soundName: "",
            createdAt: new Date(),
            updatedAt: new Date(),
            user: user as User
        }

        prismaMock.box.create.mockResolvedValue(box);

        await POST(req);

        expect(NextResponse.json).toHaveBeenCalledWith({
            message: "Pin correct!",
            error: false,
            status: 200,
            ok: true,
        });
    });
});
