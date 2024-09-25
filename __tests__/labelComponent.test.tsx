import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { MantineProvider } from '@mantine/core';
import { useSession } from 'next-auth/react';
import LabelComponent from '@/components/Label';

// Mock the `useSession` hook from next-auth/react
jest.mock('next-auth/react');

describe('Label Component', () => {
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

        const label = {
            id: "123",
            title: "plates",
            type: "NORMAL",
        }

        // Render the Home component
        render(
            <MantineProvider>
                <LabelComponent label={label} printBtn />
            </MantineProvider>
        );

        const labelText = "plates";

        // Assert
        expect(await screen.getByRole('heading', { level: 3 }));
        expect(await screen.getByText(labelText)).toBeInTheDocument();
    });

    it('renders label type', async () => {
        // Mock session data
        (useSession as jest.Mock).mockReturnValue({
            data: {
                user: {
                    email: "test@gmail.com"
                }
            },
            status: 'authenticated',
        });

        const label = {
            id: "123",
            title: "plates",
            type: "NORMAL",
        }

        // Render the Home component
        render(
            <MantineProvider>
                <LabelComponent label={label} printBtn />
            </MantineProvider>
        );

        const labelType = label.type;

        // Assert
        expect(await screen.getByText(labelType)).toBeInTheDocument();
    });

    it('renders label print btn', async () => {
        // Mock session data
        (useSession as jest.Mock).mockReturnValue({
            data: {
                user: {
                    email: "test@gmail.com"
                }
            },
            status: 'authenticated',
        });

        const label = {
            id: "123",
            title: "plates",
            type: "NORMAL",
        }

        // Render the Home component
        render(
            <MantineProvider>
                <LabelComponent label={label} printBtn />
            </MantineProvider>
        );

        // Assert
        const printBtn = screen.getByRole("button");
        expect(printBtn).toBeInTheDocument();
    });
});
