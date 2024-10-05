import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { MantineProvider } from '@mantine/core';
import { useSession } from 'next-auth/react';
import RegisterPage from '@/app/(account)/register/page';

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
                <RegisterPage />
            </MantineProvider>
        );

        // Expected element
        const header = screen.getByRole('heading', { level: 1 });

        // Assert
        expect(header);
    });

    it("renders register form with three inputs and a submit btn", () => {
        // Mock session data
        (useSession as jest.Mock).mockReturnValue({
            data: null,
            status: 'unauthenticated',
        });

        // Render the Home component
        render(
            <MantineProvider>
                <RegisterPage />
            </MantineProvider>
        );

          // Assert that the header is rendered
        const header = screen.getByRole('heading', { level: 1 });
        expect(header).toBeInTheDocument();

        const submitBtn = screen.getByRole("button");
        expect(submitBtn).toBeInTheDocument();

        // Assert two input fields
        const emailInput = screen.getByLabelText('Email');
        const passwordInput1 = screen.getByLabelText('Password');
        const passwordInput2 = screen.getByLabelText('Verify Password');
        expect(emailInput).toBeInTheDocument();
        expect(passwordInput1).toBeInTheDocument();
        expect(passwordInput2).toBeInTheDocument();
    });
});
