import { NextRequest, NextResponse } from 'next/server';
import { POST } from '../src/app/api/label/add/route';

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
        const req = {
            json: jest.fn().mockResolvedValue({
                labelTitle: "test"
            }),
        } as unknown as NextRequest;

        const res = {} as NextResponse;

        const response = await POST(req);

        expect(NextResponse.json).toHaveBeenCalledWith({
            message: "No email provided!",
            error: true,
            status: 401,
            ok: false,
        });
    });

    it('returns an error if labelTitle is missing', async () => {
        const req = {
            json: jest.fn().mockResolvedValue({
                email: "test@gmail.com"
            }),
        } as unknown as NextRequest;

        const res = {} as NextResponse;

        const response = await POST(req);

        expect(NextResponse.json).toHaveBeenCalledWith({
            message: "No label title provided!",
            error: true,
            status: 401,
            ok: false,
        });
    });
});
