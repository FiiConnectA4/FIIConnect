import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import StudentLayout from './StudentLayout';
import StudentSidebar from '../components/Sidebar-Student/StudentSidebar';

jest.mock('../components/Sidebar-Student/StudentSidebar', () => () => <div>Sidebar</div>);

describe('StudentLayout Component', () => {
    test('renders AdminSidebar and Outlet content', () => {
        const OutletMock = () => <div>Outlet Content</div>;
        render(
            <MemoryRouter>
                <StudentLayout />
                <OutletMock />
            </MemoryRouter>
        );
        expect(screen.getByText('Sidebar')).toBeInTheDocument();
        expect(screen.getByText('Outlet Content')).toBeInTheDocument();
    });

    test('applies flex layout styles', () => {
        const { container } = render(
            <MemoryRouter>
                <StudentLayout />
            </MemoryRouter>
        );
        const wrapper = container.firstChild;
        expect(wrapper).toHaveStyle('display: flex');
        expect(wrapper).toHaveStyle('height: 100vh');
    });
});