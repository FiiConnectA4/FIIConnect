import { render, screen, fireEvent } from '@testing-library/react';
import DetaliiCurs from './DetaliiCurs';

describe('DetaliiCurs Component', () => {
    test('renders course details and back button', () => {
        const onBack = jest.fn();
        render(<DetaliiCurs onBack={onBack} />);
        expect(screen.getByText('Tehnologii Web')).toBeInTheDocument();
        expect(screen.getByText('Profesor: Popa Tudor')).toBeInTheDocument();
        expect(screen.getByText('DESCRIERE CURS:')).toBeInTheDocument();
        expect(screen.getByText('Metoda notare:(componente)')).toBeInTheDocument();
        expect(screen.getByText('Resurse bibliografice:')).toBeInTheDocument();
        expect(screen.getByText('< Înapoi')).toBeInTheDocument();
    });

    test('calls onBack when back button is clicked', () => {
        const onBack = jest.fn();
        render(<DetaliiCurs onBack={onBack} />);
        fireEvent.click(screen.getByText('< Înapoi'));
        expect(onBack).toHaveBeenCalledTimes(1);
    });
});