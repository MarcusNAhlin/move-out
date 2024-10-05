import { NextRequest, NextResponse } from 'next/server';
import { DELETE } from '../../src/app/api/account/delete/route';
import { prismaMock } from "../../singleton";

// Mock NextResponse
jest.mock('next/server', () => ({
    NextResponse: {
        json: jest.fn().mockImplementation((data) => ({
            ...data,
            status: 200,
        })),
    },
}));

describe('Profile delete API test', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('returns an error if email is missing', async () => {
        const req = {
            json: jest.fn().mockResolvedValue({
                token: "test"
            }),
        } as unknown as NextRequest;

        const res = {} as NextResponse;

        const response = await DELETE(req);

        expect(NextResponse.json).toHaveBeenCalledWith({
            message: "Can't find email!",
            error: true,
            status: 401,
            ok: false,
        },
        {
            status: 401,
            statusText: "Can't find email!",
        });
    });

    it('returns an error if token is missing', async () => {
        const req = {
            json: jest.fn().mockResolvedValue({
                email: "test@gmail.com"
            }),
        } as unknown as NextRequest;

        const res = {} as NextResponse;

        const response = await DELETE(req);

        expect(NextResponse.json).toHaveBeenCalledWith({
            message: "Invalid token",
            error: true,
            status: 401,
            ok: false,
        },
        {
            status: 401,
            statusText: "Invalid token",
        });
    });

    it('returns an error user not found', async () => {
        prismaMock.user.findUnique.mockResolvedValue(null);

        const req = {
            json: jest.fn().mockResolvedValue({
                email: "invalidEmail",
                token: "test"
            }),
        } as unknown as NextRequest;

        const res = {} as NextResponse;

        const response = await DELETE(req);

        expect(NextResponse.json).toHaveBeenCalledWith({
            message: "Can't find user!",
            error: true,
            status: 401,
            ok: false,
        },
        {
            status: 401,
            statusText: "Can't find user",
        });
    });
});
