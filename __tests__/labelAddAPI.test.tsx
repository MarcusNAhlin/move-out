import { NextRequest, NextResponse } from 'next/server';
import { POST } from '../src/app/api/label/add/route';
import { prismaMock } from '../singleton';
import { addLabel } from '@/database_calls/labels';

type LabelType = "NORMAL" | "FRAGILE" | "HAZARDOUS";

// Mock NextResponse
jest.mock('next/server', () => ({
    NextResponse: {
        json: jest.fn().mockImplementation((data) => ({
            ...data,
            status: 200,
        })),
    },
}));

describe('Label add API', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('returns an error if email is missing', async () => {
        const formData = new FormData();
        formData.append("labelTitle", "test");
        formData.append("labelDesign", "NORMAL");

        const req = {
            formData: jest.fn().mockResolvedValue(formData),
        } as unknown as NextRequest;

        const res = {} as NextResponse;

        const response = await POST(req);

        expect(NextResponse.json).toHaveBeenCalledWith({
            message: "No email provided!",
            error: true,
            status: 401,
            ok: false,
        }, { status: 401 });
    });

    it('returns an error if labelTitle is missing', async () => {
        const formData = new FormData();
        formData.append("email", "test@gmail.com");
        formData.append("labelDesign", "NORMAL");

        const req = {
            formData: jest.fn().mockResolvedValue(formData),
        } as unknown as NextRequest;

        const res = {} as NextResponse;

        const response = await POST(req);

        expect(NextResponse.json).toHaveBeenCalledWith({
            message: "No label title provided!",
            error: true,
            status: 401,
            ok: false,
        }, { status: 401 });
    });

    it('returns an error if labelDesign is missing', async () => {
        const formData = new FormData();
        formData.append("email", "test@gmail.com");
        formData.append("labelTitle", "test");

        const req = {
            formData: jest.fn().mockResolvedValue(formData),
        } as unknown as NextRequest;

        const res = {} as NextResponse;

        const response = await POST(req);

        expect(NextResponse.json).toHaveBeenCalledWith({
            message: "No label design provided!",
            error: true,
            status: 401,
            ok: false,
        }, { status: 401});
    });

    it('returns success when creating label', async () => {
        const req = {
            json: jest.fn().mockResolvedValue({
                email: "test@gmail.com",
                labelTitle: "test",
                labelDesign: "NORMAL"
            }),
        } as unknown as NextRequest;

        const createdAt = new Date();
        const updatedAt = new Date();

        const label = {
            id: "291b8587-314c-4ab7-ac17-76fb9048c328",
            userId: 1,
            title: "test label",
            text: "",
            type: "NORMAL" as LabelType,
            imageName: "",
            soundPath: "",
            createdAt: createdAt,
            updatedAt: updatedAt
        };

        prismaMock.label.create.mockResolvedValue(label);

        await expect(addLabel(label)).resolves.toEqual({
            id: "291b8587-314c-4ab7-ac17-76fb9048c328",
            userId: 1,
            title: "test label",
            text: "",
            type: "NORMAL" as LabelType,
            imageName: "",
            soundPath: "",
            createdAt: createdAt,
            updatedAt: updatedAt
        });
    });
});
