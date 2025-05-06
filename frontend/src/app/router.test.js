import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AppRoutes from './router';


jest.mock('../pages/Login', () => () => <div>Login Page</div>);
jest.mock('../layouts/MainLayout', () => {
    const { Outlet } = require('react-router-dom');
    return () => (
        <div>
            Main Layout
            <Outlet />
        </div>
    );
});
jest.mock('../pages/Dashboard', () => () => <div>Dashboard Page</div>);
jest.mock('../pages/Anunturi', () => () => <div>Anunturi Page</div>);
jest.mock('../pages/Harta', () => () => <div>Harta Page</div>);
jest.mock('../pages/Cursuri/Cursuri', () => () => <div>Cursuri Page</div>);
jest.mock('../pages/Catalog', () => () => <div>Catalog Page</div>);
jest.mock('../pages/Orar', () => () => <div>Orar Page</div>);
jest.mock('../pages/Chat', () => () => <div>Chat Page</div>);
jest.mock('../pages/Contul', () => () => <div>Contul Page</div>);
jest.mock('../pages/Contact', () => () => <div>Contact Page</div>);

describe('AppRoutes Component', () => {
    test('renders Login page at root path', () => {
        render(
            <MemoryRouter initialEntries={['/']}>
                <AppRoutes />
            </MemoryRouter>
        );
        expect(screen.getByText('Login Page')).toBeInTheDocument();
    });

    test('renders MainLayout with Dashboard at /app/dashboard', () => {
        render(
            <MemoryRouter initialEntries={['/app/dashboard']}>
                <AppRoutes />
            </MemoryRouter>
        );
        expect(screen.getByText('Main Layout')).toBeInTheDocument();
        expect(screen.getByText('Dashboard Page')).toBeInTheDocument();
    });

    test('redirects from /app to /app/dashboard', () => {
        render(
            <MemoryRouter initialEntries={['/app']}>
                <AppRoutes />
            </MemoryRouter>
        );
        expect(screen.getByText('Main Layout')).toBeInTheDocument();
        expect(screen.getByText('Dashboard Page')).toBeInTheDocument();
    });

    test('redirects unknown paths to /', () => {
        render(
            <MemoryRouter initialEntries={['/unknown']}>
                <AppRoutes />
            </MemoryRouter>
        );
        expect(screen.getByText('Login Page')).toBeInTheDocument();
    });
});