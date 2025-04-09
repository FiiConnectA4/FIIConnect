import { useState } from 'react';
import Ceas from './../Components/Ceas';
import Carte from '../Components/Carte';
import Buton from '../Components/Buton';
import './Student.css';
import DetaliiCurs from './DetaliiCurs';

const Student = () => {
    const [selectedCursId, setSelectedCursId] = useState(null);
    const [cursuri] = useState([
        { id: 1, nume: 'Technologii Web' },
        { id: 2, nume: 'Ingineria Programării' },
        { id: 3, nume: 'Introducere în programare' },
        { id: 4, nume: 'Sisteme de operare' },
    ]);

    const an = 2;
    const semestru = 2;

    if (selectedCursId) {
        const cursSelectat = cursuri.find(c => c.id === selectedCursId);
        return <DetaliiCurs
            curs={cursSelectat}
            onBack={() => setSelectedCursId(null)}
        />;
    }

    return (
        <div className="container-cursuri">
            <div className="cursuri-titlu">
                <h1>Cursuri</h1>
                <h2>Anul {an} semestrul {semestru}</h2>
            </div>
            <div className="lista-cursuri">
                {cursuri.map((curs) => (
                    <div key={curs.id} className="rand-curs">
                        <Carte />
                        <Ceas />
                        <Buton
                            text={curs.nume}
                            onNavigate={() => setSelectedCursId(curs.id)}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Student;