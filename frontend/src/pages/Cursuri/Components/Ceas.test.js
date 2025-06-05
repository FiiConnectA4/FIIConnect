import { render, screen } from '@testing-library/react';
import Ceas from './Ceas';

describe('Ceas Component', () => {
    test('renders image with correct alt text', () => {
        render(<Ceas />);
        const img = screen.getByAltText('Ceas curs');
        expect(img).toBeInTheDocument();
        expect(img).toHaveAttribute('src', '/Clock.png'); // Verificăm sursa imaginii
    });

    test('renders button containing the image', () => {
        render(<Ceas />);
        const buttonElement = screen.getByRole('button');
        expect(buttonElement).toBeInTheDocument();
        const img = screen.getByAltText('Ceas curs');
        expect(buttonElement).toContainElement(img); // Verificăm că imaginea este în buton
    });

    test('applies correct classes to the image and button', () => {
        render(<Ceas />);
        const buttonElement = screen.getByRole('button');
        expect(buttonElement).toHaveClass('buton-icon'); // Verificăm clasa butonului

        const img = screen.getByAltText('Ceas curs');
        expect(img).toHaveClass('icon-curs'); // Verificăm clasa imaginii
    });
});