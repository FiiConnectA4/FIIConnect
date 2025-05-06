import { render, screen, fireEvent } from '@testing-library/react';
import Edit from './Edit';

describe('Edit Component', () => {
    test('renders button with image', () => {
        render(<Edit value="" onChange={() => { }} />);
        const buttonElement = screen.getByRole('button');
        expect(buttonElement).toBeInTheDocument();

        const imgElement = screen.getByAltText('Modificare');
        expect(imgElement).toBeInTheDocument();
        expect(imgElement).toHaveAttribute('src', '/Modificare.png');
    });

    test('toggles textarea visibility when button is clicked', () => {
        render(<Edit value="" onChange={() => { }} />);
        const buttonElement = screen.getByRole('button');

        // Inițial, textarea nu este afișat
        expect(screen.queryByRole('textbox')).not.toBeInTheDocument();

        // Click pe buton pentru a afișa textarea
        fireEvent.click(buttonElement);
        expect(screen.getByRole('textbox')).toBeInTheDocument();

        // Click pe buton pentru a ascunde textarea
        fireEvent.click(buttonElement);
        expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    });

    test('calls onChange when textarea value changes', () => {
        const handleChange = jest.fn();
        render(<Edit value="Test" onChange={handleChange} />);
        const buttonElement = screen.getByRole('button');

        // Afișăm textarea
        fireEvent.click(buttonElement);
        const textareaElement = screen.getByRole('textbox');

        // Simulăm schimbarea valorii
        fireEvent.change(textareaElement, { target: { value: 'New Value' } });
        expect(handleChange).toHaveBeenCalledWith('New Value');
    });

    test('textarea displays the correct value', () => {
        render(<Edit value="Initial Value" onChange={() => { }} />);
        const buttonElement = screen.getByRole('button');

        // Afișăm textarea
        fireEvent.click(buttonElement);
        const textareaElement = screen.getByRole('textbox');

        // Verificăm valoarea afișată
        expect(textareaElement).toHaveValue('Initial Value');
    });
});