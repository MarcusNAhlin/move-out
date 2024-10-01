// import { NextRequest, NextResponse } from 'next/server';
// import { prismaMock } from '../singleton';
// import { registerUser } from '@/database_calls/register';
// // import { User, Role, LabelType, Label, VerificationToken } from '@/lib/types';
// // import { Prisma } from '@prisma/client';
// import { Prisma, Role, LabelType, User } from '@prisma/client';

// // Mock NextResponse
// jest.mock('next/server', () => ({
//     NextResponse: {
//         json: jest.fn().mockImplementation((data) => ({
//             ...data,
//             status: 200,
//         })),
//     },
// }));

// describe('User register API', () => {
//     beforeEach(() => {
//         jest.clearAllMocks();
//     });

//     it('returns success when creating label', async () => {
//         const req = {
//             json: jest.fn().mockResolvedValue({}),
//         } as unknown as NextRequest;

//         const createdAt = new Date();
//         const updatedAt = new Date();

//         const user: Prisma.UserUncheckedCreateInput = {
//             id: 1,
//             email: "test@gmail.com",
//             hash_pass: "test",
//             role: "USER" as Role,
//             verified: false,
//             createdAt: createdAt,
//             updatedAt: updatedAt,
//             labels: [{
//                 id: "1",
//                 userId: 1,
//                 title: "test",
//                 type: "NORMAL" as LabelType,
//                 text: "test",
//                 picturePath: "test",
//                 soundPath: "test",
//                 createdAt: createdAt,
//                 updatedAt: updatedAt,
//                 user: {} as User
//             }] as Prisma.LabelUncheckedCreateInput[],
//             token: {} as Prisma.VerificationTokenUncheckedCreateInput
//         };

//         prismaMock.label.create.mockResolvedValue(user);

//         await expect(registerUser(user)).resolves.toEqual({
//             id: 1,
//             email: "test@gmail.com",
//             hash_pass: "test",
//             role: "USER" as Role,
//             verified: false,
//             createdAt: createdAt,
//             updatedAt: updatedAt
//         });
//     });
// });
