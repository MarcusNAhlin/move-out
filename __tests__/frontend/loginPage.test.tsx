import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { MantineProvider } from '@mantine/core';
import { useSession } from 'next-auth/react';
import LoginPage from '@/app/(account)/login/page';

// Mock the useSession
jest.mock('next-auth/react');

// Mock router
jest.mock("next/navigation", () => ({
    useRouter() {
        return {
            prefetch: () => null
        };
    }
}));

describe('Login Page', () => {
    it('renders an h1 header', () => {
        // Mock session data
        (useSession as jest.Mock).mockReturnValue({
            data: null,
            status: 'unauthenticated',
        });

        // Render the Home component
        render(
            <MantineProvider>
                <LoginPage />
            </MantineProvider>
        );

        // Expected element
        const header = screen.getByRole('heading', { level: 1 });

        // Assert
        expect(header);
    });

    it("renders login form with two inputs and a submit btn", () => {
        // Mock session data
        (useSession as jest.Mock).mockReturnValue({
            data: null,
            status: 'unauthenticated',
        });

        // Render the Home component
        render(
            <MantineProvider>
                <LoginPage />
            </MantineProvider>
        );

          // Assert that the header is rendered
        const header = screen.getByRole('heading', { level: 1 });
        expect(header).toBeInTheDocument();

        const submitBtn = screen.getByRole("button");
        expect(submitBtn).toBeInTheDocument();

        // Assert two input fields
        const emailInput = screen.getByLabelText('Email');
        const passwordInput = screen.getByLabelText('Password');
        expect(emailInput).toBeInTheDocument();
        expect(passwordInput).toBeInTheDocument();
    });
});
