import { render, screen } from '@testing-library/react';
import Ceas from './Ceas';

describe('Ceas Component', () => {
    test('renders image with correct alt text', () => {
        render(<Ceas />);
        const img = screen.getByAltText('Ceas curs');
        expect(img).toBeInTheDocument();
        expect(img).toHaveAttribute('src', '/Clock.png');
    });
});