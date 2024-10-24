import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { MantineProvider } from '@mantine/core';
import { useSession } from 'next-auth/react';
import Home from '@/app/page';

// Mock the `useSession` hook from next-auth/react
jest.mock('next-auth/react');

describe('Home Page', () => {
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

        // Render the Home component
        render(
            <MantineProvider>
                <Home />
            </MantineProvider>
        );

        const expectedText = "Welcome, test@gmail.com"

        // Assert
        expect(await screen.getByText(expectedText)).toBeInTheDocument();
    });

    it('renders visit profile btn if signed in', async () => {
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
                <Home />
            </MantineProvider>
        );

        // Assert
        expect(await screen.getByRole("link", { name: "Visit Profile"})).toBeInTheDocument();
    });
});
