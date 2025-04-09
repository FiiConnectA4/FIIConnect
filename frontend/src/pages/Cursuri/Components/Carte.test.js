import { render, screen } from '@testing-library/react';
import Carte from './Carte';

describe('Carte Component', () => {
    test('renders image with correct alt text', () => {
        render(<Carte />);
        const img = screen.getByAltText('Carte curs');
        expect(img).toBeInTheDocument();
        expect(img).toHaveAttribute('src', '/Book open.png');
    });
});