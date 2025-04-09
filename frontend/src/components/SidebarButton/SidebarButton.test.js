import { render, screen } from '@testing-library/react';
import { MemoryRouter, NavLink } from 'react-router-dom';
import SidebarButton from './SidebarButton';


jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    NavLink: ({ to, children, className }) => (
        <a href={to} className={typeof className === 'function' ? className({ isActive: false }) : className}>
            {children}
        </a>
    ),
}));

describe('SidebarButton Component', () => {
    test('renders icon and label', () => {
        render(
            <MemoryRouter>
                <SidebarButton icon="📚" label="Cursuri" to="/app/cursuri" />
            </MemoryRouter>
        );
        expect(screen.getByText('📚')).toBeInTheDocument();
        expect(screen.getByText('Cursuri')).toBeInTheDocument();
    });

    test('sets correct link path', () => {
        render(
            <MemoryRouter>
                <SidebarButton icon="📚" label="Cursuri" to="/app/cursuri" />
            </MemoryRouter>
        );
        const link = screen.getByText('Cursuri').closest('a');
        expect(link).toHaveAttribute('href', '/app/cursuri');
    });

    test('applies active class when route is active', () => {
        render(
            <MemoryRouter initialEntries={['/app/cursuri']}>
                <SidebarButton icon="📚" label="Cursuri" to="/app/cursuri" />
            </MemoryRouter>
        );
        const link = screen.getByText('Cursuri').closest('a');
        expect(link).toHaveClass('sidebar-button');
    });
});