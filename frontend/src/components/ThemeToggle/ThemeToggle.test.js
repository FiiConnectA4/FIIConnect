import { render, screen, fireEvent } from '@testing-library/react';
import ThemeToggle from './ThemeToggle';

describe('ThemeToggle Component', () => {
    test('renders light theme button by default', () => {
        render(<ThemeToggle />);
        expect(screen.getByText('🌙 Dark')).toBeInTheDocument();
    });

    test('renders dark theme button when theme is dark', () => {
        const { rerender } = render(<ThemeToggle />);
        jest.spyOn(require('../../app/ThemeContext'), 'useTheme').mockReturnValue({
            theme: 'dark',
            toggleTheme: jest.fn(),
        });
        rerender(<ThemeToggle />);
        expect(screen.getByText('☀️ Light')).toBeInTheDocument();
    });

    test('calls toggleTheme on click', () => {
        const toggleTheme = jest.fn();
        jest.spyOn(require('../../app/ThemeContext'), 'useTheme').mockReturnValue({
            theme: 'light',
            toggleTheme,
        });
        render(<ThemeToggle />);
        fireEvent.click(screen.getByText('🌙 Dark'));
        expect(toggleTheme).toHaveBeenCalledTimes(1);
    });
});