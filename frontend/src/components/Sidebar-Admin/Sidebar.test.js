import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';

jest.mock('../SidebarButton/SidebarButton', () => ({ icon, label, to }) => (
    <div data-testid={`button-${label}`} data-to={to}>
        {icon} {label}
    </div>
));
jest.mock('../ThemeToggle/ThemeToggle', () => () => <div>Theme Toggle</div>);

describe('AdminSidebar Component', () => {
    test('renders logo and footer', () => {
        render(
            <MemoryRouter>
                <AdminSidebar />
            </MemoryRouter>
        );
        expect(screen.getByText(/FIIConnect/i)).toBeInTheDocument();
        expect(screen.getByText('2025 © FIIConnect')).toBeInTheDocument();
    });

    test('renders general section links', () => {
        render(
            <MemoryRouter>
                <AdminSidebar />
            </MemoryRouter>
        );
        expect(screen.getByText('GENERAL')).toBeInTheDocument();
        expect(screen.getByTestId('button-Dashboard')).toHaveAttribute('data-to', '/app/dashboard');
        expect(screen.getByTestId('button-Cursuri')).toHaveAttribute('data-to', '/app/cursuri');
    });

    test('renders management section links', () => {
        render(
            <MemoryRouter>
                <AdminSidebar />
            </MemoryRouter>
        );
        expect(screen.getByText('MANAGEMENT')).toBeInTheDocument();
        expect(screen.getByTestId('button-Contul')).toHaveAttribute('data-to', '/app/contul');
        expect(screen.getByTestId('button-Contact')).toHaveAttribute('data-to', '/app/contact');
    });

    test('renders ThemeToggle', () => {
        render(
            <MemoryRouter>
                <AdminSidebar />
            </MemoryRouter>
        );
        expect(screen.getByText('Theme Toggle')).toBeInTheDocument();
    });
});