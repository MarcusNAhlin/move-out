import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { MantineProvider } from '@mantine/core';
import { useSession } from 'next-auth/react';
import ProfilePage from '@/app/(account)/profile/page';

// Mock the `useSession` hook from next-auth/react
jest.mock('next-auth/react');

describe('Profile Page', () => {
    it('renders profile header', async () => {
        // Mock session data
        (useSession as jest.Mock).mockReturnValue({
            data: {
                user: {
                    email: "test@gmail.com"
                }
            },
            status: 'authenticated',
        });

        // Render the Home component
        render(
            <MantineProvider>
                <ProfilePage />
            </MantineProvider>
        );

        const profileText = "Profile";

        // Assert
        expect(await screen.getByRole('heading', { level: 1 }));
        expect(await screen.getByText(profileText)).toBeInTheDocument();
    });

    it('renders welcome message with email if signed in', async () => {
        // Mock session data
        (useSession as jest.Mock).mockReturnValue({
            data: {
                user: {
                    email: "test@gmail.com"
                }
            },
            status: 'authenticated',
        });

        // Render the Home component
        render(
            <MantineProvider>
                <ProfilePage />
            </MantineProvider>
        );


        // Assert
        expect(await screen.getByText("Welcome, test@gmail.com!")).toBeInTheDocument();
    });

    it('renders sign in button if not signed in', async () => {
        // Mock session data
        (useSession as jest.Mock).mockReturnValue({
            data: null,
            status: 'unauthenticated',
        });

        // Render the Home component
        render(
            <MantineProvider>
                <ProfilePage />
            </MantineProvider>
        );

        // Assert
        expect(await screen.getByRole("button", { name: "Log In" })).toBeInTheDocument();
    });

    it('renders sign out button if signed in', async () => {
        // Mock session data
        (useSession as jest.Mock).mockReturnValue({
            data: {
                user: {
                    email: "test@gmail.com"
                }
            },
            status: 'authenticated',
        });

        // Render the Home component
        render(
            <MantineProvider>
                <ProfilePage />
            </MantineProvider>
        );

        // Assert
        expect(await screen.getByRole("button", { name: "Sign Out" })).toBeInTheDocument();
    });

    it("renders delete account btn if signed in", async () => {
        // Mock session data
        (useSession as jest.Mock).mockReturnValue({
            data: {
                user: {
                    email: "test@gmail.com"
                }
            },
            status: 'authenticated',
            });

            render (
                <MantineProvider>
                    <ProfilePage />
                </MantineProvider>
            );

            // Assert
            expect(await screen.getByText("Delete Account")).toBeInTheDocument();
        });
});
