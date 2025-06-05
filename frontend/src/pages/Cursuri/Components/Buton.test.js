import { render, screen, fireEvent } from '@testing-library/react';
import Buton from './Buton';

describe('Buton Component', () => {
    test('renders button with provided text', () => {
        render(<Buton text="Click Me" onNavigate={() => { }} />);
        const buttonElement = screen.getByText('Click Me');
        expect(buttonElement).toBeInTheDocument();
    });

    test('calls onNavigate when clicked', () => {
        const onNavigate = jest.fn();
        render(<Buton text="Click Me" onNavigate={onNavigate} />);
        const buttonElement = screen.getByText('Click Me');
        fireEvent.click(buttonElement);
        expect(onNavigate).toHaveBeenCalledTimes(1);
    });

    test('applies custom className if provided', () => {
        render(<Buton text="Click Me" onNavigate={() => { }} className="custom-class" />);
        const buttonElement = screen.getByText('Click Me');
        expect(buttonElement).toHaveClass('custom-class');
    });

    test('applies default className if no custom className is provided', () => {
        render(<Buton text="Click Me" onNavigate={() => { }} />);
        const buttonElement = screen.getByText('Click Me');
        expect(buttonElement).toHaveClass('buton-curs');
    });
});