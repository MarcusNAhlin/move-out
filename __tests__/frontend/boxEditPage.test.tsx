import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { MantineProvider } from '@mantine/core';
import { useSession } from 'next-auth/react';
import BoxEditPage from '@/app/box/edit/[id]/page';

// Mock the `useSession` hook from next-auth/react
jest.mock('next-auth/react');

// Mock router
jest.mock("next/navigation", () => ({
    useRouter() {
        return {
            prefetch: () => null
        };
    },
    useParams() {
        return { id: 'test-id-123' };
    }
}));

describe('Box Edit Page', () => {
    it('renders "not logged in" if not', async () => {
        // Mock session data
        (useSession as jest.Mock).mockReturnValue({
            data: null,
            status: 'unauthenticated',
        });

        // Render the EditPage component
        render(
            <MantineProvider>
                <BoxEditPage />
            </MantineProvider>
        );

        const notSignedInText = "You need to log in to add boxes";

        // Assert
        expect(await screen.getByText(notSignedInText)).toBeInTheDocument();
    });
});
