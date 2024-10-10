import { NextRequest, NextResponse } from 'next/server';
import { POST } from '@/app/api/admin/sendPromotionEmail/route';
import { prismaMock } from '../../singleton';

// Mock NextResponse
jest.mock('next/server', () => ({
    NextResponse: {
        json: jest.fn().mockImplementation((data) => ({
            ...data,
            status: 200,
        })),
    },
}));

describe('Admin send promotion email API', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('return error if from-user is missing', async () => {
        const req = {
            json: jest.fn().mockResolvedValue({
                subject: "Test subject",
                mailContent: "Test content",
            }),
        } as unknown as NextRequest;

        const res = {} as NextResponse;

        const response = await POST(req);

        expect(NextResponse.json).toHaveBeenCalledWith({
            message: "Missing from-user!",
            error: true,
            status: 401,
            ok: false,
        });
    });

    it('return error if subject is missing', async () => {
        const req = {
            json: jest.fn().mockResolvedValue({
                from: "Test <test@test.test>",
                mailContent: "Test content",
            }),
        } as unknown as NextRequest;

        const res = {} as NextResponse;

        const response = await POST(req);

        expect(NextResponse.json).toHaveBeenCalledWith({
            message: "Missing subject!",
            error: true,
            status: 401,
            ok: false,
        });
    });

    it('return error if email content is missing', async () => {
        const req = {
            json: jest.fn().mockResolvedValue({
                from: "Test <test@test.test>",
                subject: "Test subject",
            }),
        } as unknown as NextRequest;

        const res = {} as NextResponse;

        const response = await POST(req);

        expect(NextResponse.json).toHaveBeenCalledWith({
            message: "Missing email content!",
            error: true,
            status: 401,
            ok: false,
        });
    });
});
