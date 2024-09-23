import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { MantineProvider } from '@mantine/core';
import { useSession } from 'next-auth/react';
import Home from '../src/app/page';

// Mock the `useSession` hook from next-auth/react
jest.mock('next-auth/react');

describe('Home Page', () => {
    it('renders label header', async () => {
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

        const labelText = "Labels";

        // Assert
        expect(await screen.getByRole('heading', { level: 2 }));
        expect(await screen.getByText(labelText)).toBeInTheDocument();
    });

    it('dont render labels if not signed in', async () => {
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

        const labelText = "Labels";

        // Assert
        expect(await screen.queryByText(labelText)).not.toBeInTheDocument();
    });

    it('renders add label btn if signed in', async () => {
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

        const buttonText = "+"

        // Assert
        expect(await screen.getByRole("button")).toBeInTheDocument();
        expect(await screen.getByText(buttonText)).toBeInTheDocument();
    });
});
