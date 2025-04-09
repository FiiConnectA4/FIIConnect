import { render, screen, fireEvent } from '@testing-library/react';
import Buton from './Buton';

describe('Buton Component', () => {
    test('renders button with text', () => {
        render(<Buton text="Click Me" onNavigate={() => {}} />);
        expect(screen.getByText('Click Me')).toBeInTheDocument();
    });

    test('calls onNavigate when clicked', () => {
        const onNavigate = jest.fn();
        render(<Buton text="Click Me" onNavigate={onNavigate} />);
        fireEvent.click(screen.getByText('Click Me'));
        expect(onNavigate).toHaveBeenCalledTimes(1);
    });
});