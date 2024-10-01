import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { MantineProvider } from '@mantine/core';
import { useSession } from 'next-auth/react';
import LabelAddPage from '../src/app/label/add/page';

// Mock the `useSession` hook from next-auth/react
jest.mock('next-auth/react');

// Mock router
jest.mock("next/navigation", () => ({
    useRouter() {
        return {
            prefetch: () => null
        };
    }
}));

describe('Label Add Page', () => {
    it('renders label add header', async () => {
        // Mock session data
        (useSession as jest.Mock).mockReturnValue({
            data: {
                user: {
                    email: "test@gmail.com"
                }
            },
            status: 'authenticated',
        });

        // Render the Label component
        render(
            <MantineProvider>
                <LabelAddPage />
            </MantineProvider>
        );

        const titleText = "Add Label";
        const titelTextElements = await screen.getAllByText(titleText);

        // Assert
        expect(await screen.getByRole('heading', { level: 1 }));

        expect(titelTextElements.length).toBeGreaterThan(0);
    });

    it('renders input text data form', async () => {
        // Mock session data
        (useSession as jest.Mock).mockReturnValue({
            data: {
                user: {
                    email: "test@gmail.com"
                }
            },
            status: 'authenticated',
        });

        // Render the Label component
        render(
            <MantineProvider>
                <LabelAddPage />
            </MantineProvider>
        );


        // Assert
        // Test that there are 3 inputs/textareas
        const textboxes = screen.getAllByRole('textbox');
        expect(textboxes.length).toBe(3);
    });
});
