import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { MantineProvider } from '@mantine/core'; // Import MantineProvider
import { useSession } from 'next-auth/react';
import Home from '../src/app/page'; // Adjust path as needed

// Mock the `useSession` hook from next-auth/react
jest.mock('next-auth/react');

describe('Home Page', () => {
    it('renders an h1', () => {
    // Mock session data (can be authenticated or unauthenticated, irrelevant for h1 test)
    (useSession as jest.Mock).mockReturnValue({
        data: null,
        status: 'unauthenticated',
    });

    // Render the Home component wrapped in MantineProvider
    render(
        <MantineProvider>
        <Home />
        </MantineProvider>
    );

    const header = screen.getByRole('heading', { level: 1 });

    // Assert that the h1 (Mantine's Title component) contains "MoveOut"
    expect(header);
    });
});
