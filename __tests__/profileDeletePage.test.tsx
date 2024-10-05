import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { MantineProvider } from '@mantine/core';
import { useSession } from 'next-auth/react';
import ProfileDeletePage from '../src/app/(account)/profile/delete-account/page';

// Mock the `useSession` hook from next-auth/react
jest.mock('next-auth/react');

describe('Profile Delete Page', () => {
    it('renders delete account header', async () => {
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
                <ProfileDeletePage />
            </MantineProvider>
        );

        const headingText = "Delete Account";

        // Assert
        expect(await screen.getByRole('heading', { level: 1 , name: headingText}));
    });

    it('renders delete account button if signed in', async () => {
        // Mock session data
        (useSession as jest.Mock).mockReturnValue({
            data: {
                user: {
                    email: "test@gmail.com"
                }
            },
            status: 'authenticated',
        });

        render(
            <MantineProvider>
                <ProfileDeletePage />
            </MantineProvider>
        );

        // Assert
        expect(await screen.getByRole("button", { name: "Delete Account"})).toBeInTheDocument();
    });

    // Test if mail is displayed
    it('renders email if signed in', async () => {
        // Mock session data
        (useSession as jest.Mock).mockReturnValue({
            data: {
                user: {
                    email: "test@gmail.com"
                }
            },
            status: 'authenticated',
        });

        render(
            <MantineProvider>
                <ProfileDeletePage />
            </MantineProvider>
        );

        // Assert
        expect(await screen.getByText("test@gmail.com")).toBeInTheDocument();
    });
});
