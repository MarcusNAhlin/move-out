import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { MantineProvider } from '@mantine/core';
import { useSession } from 'next-auth/react';
import Home from '../src/app/page';

// Mock the `useSession` hook from next-auth/react
jest.mock('next-auth/react');

describe('Home Page', () => {
    it('renders an h1 header', () => {
        // Mock session data
        (useSession as jest.Mock).mockReturnValue({
            data: null,
            status: 'unauthenticated',
        });

        // Render the Home component
        render(
            <MantineProvider>
                <Home />
            </MantineProvider>
        );

        const header = screen.getByRole('heading', { level: 1 });

        // Assert
        expect(header);
    });

    it('renders "not signed in" if not', async () => {
        // Mock session data
        (useSession as jest.Mock).mockReturnValue({
            data: null,
            status: 'unauthenticated',
        });

        // Render the Home component
        render(
            <MantineProvider>
                <Home />
            </MantineProvider>
        );

        const notSignedInText = "You are not signed in";

        // Assert
        expect(await screen.getByText(notSignedInText)).toBeInTheDocument();
    });

    it('renders login button if not signed in', async () => {
        // Mock session data
        (useSession as jest.Mock).mockReturnValue({
            data: null,
            status: 'unauthenticated',
        });

        // Render the Home component
        render(
            <MantineProvider>
                <Home />
            </MantineProvider>
        );

        const buttonText = "Sign In";

        // Assert
        expect(await screen.getByRole("button")).toBeInTheDocument();
        expect(await screen.getByText(buttonText)).toBeInTheDocument();
    });

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
