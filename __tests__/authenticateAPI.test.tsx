import { NextRequest, NextResponse } from 'next/server';
import { POST } from '../src/app/api/authenticate/route';
import { PrismaClient } from '@prisma/client';

// Mock NextResponse
jest.mock('next/server', () => ({
    NextResponse: {
        json: jest.fn().mockImplementation((data) => ({
            ...data,
            status: 200,
        })),
    },
}));

describe('authenticate function', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('returns an error if email or password is missing', async () => {
        const req = {
            json: jest.fn().mockResolvedValue({}),
        } as unknown as NextRequest;

        const res = {} as NextResponse;

        const response = await POST(req, res);

        expect(NextResponse.json).toHaveBeenCalledWith({
            message: "Missing email or password!",
            error: true,
            status: 401,
            ok: false,
        });
    });
});
