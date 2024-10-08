import { NextRequest, NextResponse } from 'next/server';
import { POST } from '@/app/api/box/edit/route';
import { prismaMock } from '../../singleton';
import { editBox } from '@/database_calls/boxes';

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

describe('Box edit API', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('returns an error if id (box id) is missing', async () => {
        const formData = new FormData();
        formData.append("boxTitle", "test");

        const req = {
            formData: jest.fn().mockResolvedValue(formData),
        } as unknown as NextRequest;

        const res = {} as NextResponse;

        const response = await POST(req);

        expect(NextResponse.json).toHaveBeenCalledWith({
            message: "No box id provided!",
            error: true,
            status: 401,
            ok: false,
        }, { status: 401, statusText: "No box id provided!" });
    });

    it('returns an error if email is missing', async () => {
        const formData = new FormData();
        formData.append("boxTitle", "test");
        formData.append("id", "test-id-123");

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

    it('returns correct box when editing box content', async () => {
        const req = {
            json: jest.fn().mockResolvedValue({
                id: "test-id-123",
                email: "test@gmail.com",
                boxTitle: "test",
                labelDesign: "NORMAL"
            }),
        } as unknown as NextRequest;

        const createdAt = new Date();
        const updatedAt = new Date();

        const box = {
            id: "test-id-123",
            userId: 1,
            title: "test label",
            text: "test text content",
            type: "NORMAL" as LabelType,
            imageName: "",
            soundName: "",
            createdAt: createdAt,
            updatedAt: updatedAt,
        };

        const editedBox = {
            id: "test-id-123",
            userId: 1,
            title: "test label edited",
            text: "test text content edited",
            type: "NORMAL" as LabelType,
        }

        prismaMock.box.create.mockResolvedValue(box);

        prismaMock.box.update.mockResolvedValue(editedBox);

        await expect(editBox(editedBox)).resolves.toEqual({
            id: "test-id-123",
            userId: 1,
            title: "test label edited",
            text: "test text content edited",
            type: "NORMAL" as LabelType,
        });
    });

    // it.skip('returns an error if image is too big', async () => {
    //     const formData = new FormData();
    //     formData.append("email", "test@gmail.com");
    //     formData.append("boxTitle", "test");
    //     formData.append("labelDesign", "NORMAL");

    //     // Create blob with size 10.1 MB (too big)
    //     const blob = new Blob([new Uint8Array(10100000)], { type: 'image/jpeg' });
    //     const file = new File([blob], "TestImage.jpg", { type: 'image/jpeg' });
    //     formData.append("boxImage", file);

    //     const req = {
    //         formData: jest.fn().mockResolvedValue(formData),
    //     } as unknown as NextRequest;

    //     const res = {} as NextResponse;

    //     const response = await POST(req);

    //     expect(NextResponse.json).toHaveBeenCalledWith({
    //         message: "Image too big!",
    //         error: true,
    //         status: 401,
    //         ok: false,
    //     }, { status: 401, statusText: "Image too big!" });
    // });

    // it.skip('returns an error if sound is too big', async () => {
    //     const formData = new FormData();
    //     formData.append("email", "test@gmail.com");
    //     formData.append("boxTitle", "test");
    //     formData.append("labelDesign", "NORMAL");

    //     // Create blob with size 10.1 MB (too big)
    //     const blob = new Blob([new Uint8Array(10100000)], { type: 'audio/webm' });
    //     const file = new File([blob], "sound.webm", { type: 'audio/webm' });
    //     formData.append("boxSound", file);

    //     const req = {
    //         formData: jest.fn().mockResolvedValue(formData),
    //     } as unknown as NextRequest;

    //     const res = {} as NextResponse;

    //     const response = await POST(req);

    //     expect(NextResponse.json).toHaveBeenCalledWith({
    //         message: "Sound too big!",
    //         error: true,
    //         status: 401,
    //         ok: false,
    //     }, { status: 401, statusText: "Sound too big!" });
    // });
});
