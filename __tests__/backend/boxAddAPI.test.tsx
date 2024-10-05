import { NextRequest, NextResponse } from 'next/server';
import { POST } from '@/app/api/box/add/route';
import { prismaMock } from '../../singleton';
import { addBox } from '@/database_calls/boxes';

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

describe('Box add API', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('returns an error if email is missing', async () => {
        const formData = new FormData();
        formData.append("boxTitle", "test");
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
        }, { status: 401, statusText: "No email provided!" });
    });

    it('returns an error if boxTitle is missing', async () => {
        const formData = new FormData();
        formData.append("email", "test@gmail.com");
        formData.append("labelDesign", "NORMAL");

        const req = {
            formData: jest.fn().mockResolvedValue(formData),
        } as unknown as NextRequest;

        const res = {} as NextResponse;

        const response = await POST(req);

        expect(NextResponse.json).toHaveBeenCalledWith({
            message: "No box title provided!",
            error: true,
            status: 401,
            ok: false,
        }, { status: 401, statusText: "No box title provided!" });
    });

    it('returns an error if labelDesign is missing', async () => {
        const formData = new FormData();
        formData.append("email", "test@gmail.com");
        formData.append("boxTitle", "test");

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
        }, { status: 401, statusText: "No label design provided!" });
    });

    it('returns success when creating label', async () => {
        const req = {
            json: jest.fn().mockResolvedValue({
                email: "test@gmail.com",
                boxTitle: "test",
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
            soundName: "",
            createdAt: createdAt,
            updatedAt: updatedAt
        };

        prismaMock.box.create.mockResolvedValue(label);

        await expect(addBox(label)).resolves.toEqual({
            id: "291b8587-314c-4ab7-ac17-76fb9048c328",
            userId: 1,
            title: "test label",
            text: "",
            type: "NORMAL" as LabelType,
            imageName: "",
            soundName: "",
            createdAt: createdAt,
            updatedAt: updatedAt
        });
    });

    it.skip('returns an error if image is too big', async () => {
        const formData = new FormData();
        formData.append("email", "test@gmail.com");
        formData.append("boxTitle", "test");
        formData.append("labelDesign", "NORMAL");

        // Create blob with size 10.1 MB (too big)
        const blob = new Blob([new Uint8Array(10100000)], { type: 'image/jpeg' });
        const file = new File([blob], "TestImage.jpg", { type: 'image/jpeg' });
        formData.append("boxImage", file);

        const req = {
            formData: jest.fn().mockResolvedValue(formData),
        } as unknown as NextRequest;

        const res = {} as NextResponse;

        const response = await POST(req);

        expect(NextResponse.json).toHaveBeenCalledWith({
            message: "Image too big!",
            error: true,
            status: 401,
            ok: false,
        }, { status: 401, statusText: "Image too big!" });
    });

    it.skip('returns an error if sound is too big', async () => {
        const formData = new FormData();
        formData.append("email", "test@gmail.com");
        formData.append("boxTitle", "test");
        formData.append("labelDesign", "NORMAL");

        // Create blob with size 10.1 MB (too big)
        const blob = new Blob([new Uint8Array(10100000)], { type: 'audio/webm' });
        const file = new File([blob], "sound.webm", { type: 'audio/webm' });
        formData.append("boxSound", file);

        const req = {
            formData: jest.fn().mockResolvedValue(formData),
        } as unknown as NextRequest;

        const res = {} as NextResponse;

        const response = await POST(req);

        expect(NextResponse.json).toHaveBeenCalledWith({
            message: "Sound too big!",
            error: true,
            status: 401,
            ok: false,
        }, { status: 401, statusText: "Sound too big!" });
    });
});
