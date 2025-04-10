import { render, screen, fireEvent } from '@testing-library/react';
import Student from './Student';
import Ceas from '../Components/Ceas'; // Adjusted path
import Carte from '../Components/Carte'; // Adjusted path
import Buton from '../Components/Buton'; // Adjusted path
import DetaliiCurs from './DetaliiCurs';


jest.mock('../Components/Ceas', () => () => <div>Ceas Mock</div>);
jest.mock('../Components/Carte', () => () => <div>Carte Mock</div>);
jest.mock('../Components/Buton', () => ({ text, onNavigate }) => (
    <button onClick={onNavigate}>{text}</button>
));
jest.mock('./DetaliiCurs', () => ({ curs, onBack }) => (
    <div>
        <h1>{curs.nume}</h1>
        <button onClick={onBack}>Back</button>
    </div>
));

describe('Student Component', () => {
    test('renders course list initially', () => {
        render(<Student />);
        expect(screen.getByText('Cursuri')).toBeInTheDocument();
        expect(screen.getByText('Anul 2 semestrul 2')).toBeInTheDocument();
        expect(screen.getByText('Technologii Web')).toBeInTheDocument();
    });

    test('navigates to course details when a course button is clicked', () => {
        render(<Student />);
        fireEvent.click(screen.getByText('Technologii Web'));
        expect(screen.getByText('Technologii Web')).toBeInTheDocument();
        expect(screen.getByText('Back')).toBeInTheDocument();
    });

    test('returns to course list when back button is clicked', () => {
        render(<Student />);
        fireEvent.click(screen.getByText('Technologii Web'));
        fireEvent.click(screen.getByText('Back'));
        expect(screen.getByText('Cursuri')).toBeInTheDocument();
        expect(screen.queryByText('Back')).not.toBeInTheDocument();
    });
});