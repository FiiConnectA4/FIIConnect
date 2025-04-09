import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import MainLayout from './MainLayout';
import Sidebar from '../components/Sidebar/Sidebar';

jest.mock('../components/Sidebar/Sidebar', () => () => <div>Sidebar</div>);

describe('MainLayout Component', () => {
    test('renders Sidebar and Outlet content', () => {
        const OutletMock = () => <div>Outlet Content</div>;
        render(
            <MemoryRouter>
                <MainLayout />
                <OutletMock />
            </MemoryRouter>
        );
        expect(screen.getByText('Sidebar')).toBeInTheDocument();
        expect(screen.getByText('Outlet Content')).toBeInTheDocument();
    });

    test('applies flex layout styles', () => {
        const { container } = render(
            <MemoryRouter>
                <MainLayout />
            </MemoryRouter>
        );
        const wrapper = container.firstChild;
        expect(wrapper).toHaveStyle('display: flex');
        expect(wrapper).toHaveStyle('height: 100vh');
    });
});