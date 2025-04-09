import { useState } from 'react';
import Ceas from './../Components/Ceas';
import Carte from '../Components/Carte';
import Buton from '../Components/Buton';
import PageControl from '../Components/PageControl';
import './../Student/Student.css';
import PDetaliiCurs from './PDetaliiCurs';

const Profesor = () => {
    const [selectedCursId, setSelectedCursId] = useState(null);
    const [cursuri] = useState([
        { id: 1, nume: 'Technologii Web', detinut: true },
        { id: 2, nume: 'Ingineria Programării', detinut: false },
        { id: 3, nume: 'Introducere în programare', detinut: true },
        { id: 4, nume: 'Sisteme de operare', detinut: false },
    ]);
    //true da span la butonul de optiuni
    const an = 2;
    const semestru = 2;

    if (selectedCursId) {
        const cursSelectat = cursuri.find(c => c.id === selectedCursId);
        return <PDetaliiCurs
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
                        {curs.detinut && <PageControl></PageControl>}
                    </div>
                ))}
            </div>
            <Buton className='Adauga' text='Adauga curs'></Buton>
        </div>
    );
};

export default Profesor;