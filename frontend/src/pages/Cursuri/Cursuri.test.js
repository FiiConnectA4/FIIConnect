import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Cursuri from './Cursuri';
import Student from './Student/Student';
import Profesor from './Profesor/Profesor';
import Administrator from './Administrator/Administrator';

jest.mock('./Student/Student', () => () => <div>Student Component</div>);
jest.mock('./Profesor/Profesor', () => () => <div>Profesor Component</div>);
jest.mock('./Administrator/Administrator', () => () => <div>Administrator Component</div>);

describe('Cursuri Component', () => {
    const renderWithRouter = (searchParams) => {
        return render(
            <MemoryRouter initialEntries={[`/?${searchParams}`]}>
                <Cursuri />
            </MemoryRouter>
        );
    };

    test('renders Student component by default when no userType is provided', () => {
        renderWithRouter('');
        expect(screen.getByText('Student Component')).toBeInTheDocument();
    });

    test('renders Student component for userType=1', () => {
        renderWithRouter('userType=1');
        expect(screen.getByText('Student Component')).toBeInTheDocument();
    });

    test('renders Profesor component for userType=2', () => {
        renderWithRouter('userType=2');
        expect(screen.getByText('Profesor Component')).toBeInTheDocument();
    });

    test('renders Administrator component for userType=3', () => {
        renderWithRouter('userType=3');
        expect(screen.getByText('Administrator Component')).toBeInTheDocument();
    });

    test('renders no user type message for userType=0', () => {
        renderWithRouter('userType=0');
        expect(screen.queryByText('Student Component')).not.toBeInTheDocument();
        expect(screen.queryByText('Profesor Component')).not.toBeInTheDocument();
        expect(screen.queryByText('Administrator Component')).not.toBeInTheDocument();
        expect(screen.getByText('No user type selected.')).toBeInTheDocument();
    });

    test('defaults to Student component for invalid userType', () => {
        renderWithRouter('userType=abc');
        expect(screen.getByText('Student Component')).toBeInTheDocument();
    });
});