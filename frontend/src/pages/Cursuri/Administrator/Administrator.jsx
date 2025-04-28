import { useState, useEffect } from 'react';
import Buton from '../Components/Buton';
import Carte from '../Components/Carte';
import Ceas from '../Components/Ceas';
import './../Student/Student.css';
import PDetaliiCurs from '../Profesor/PDetaliiCurs';

const Administrator = () => {
    const [selectedCursId, setSelectedCursId] = useState(null);
    const [cursuri, setCursuri] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/didactic/course')
            .then((response) => {
                if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
                return response.json();
            })
            .then((data) => {
                console.log('Răspuns API:', data);
                const courses = data._embedded?.courseList || [];
                setCursuri(courses);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Eroare la încărcarea cursurilor:', error);
                setCursuri([]);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (selectedCursId) {
        const cursSelectat = cursuri.find((c) => c.id === selectedCursId);
        if (!cursSelectat) {
            console.error(`Cursul cu ID ${selectedCursId} nu a fost găsit`);
            setSelectedCursId(null);
            return <div>Cursul nu a fost găsit</div>;
        }
        return (
            <PDetaliiCurs
                curs={cursSelectat}
                onBack={() => setSelectedCursId(null)}
            />
        );
    }

    return (
        <div className="container-cursuri">
            <div className="cursuri-titlu">
                <h1>Administrare Cursuri</h1>
                <Ceas />
            </div>
            <div className="lista-cursuri">
                {cursuri.length > 0 ? (
                    cursuri.map((curs) => (
                        <div key={curs.id} className="rand-curs">
                            <Carte />
                            <Ceas idCurs={curs.id} />
                            <Buton text={curs.title} onNavigate={() => setSelectedCursId(curs.id)} />
                        </div>
                    ))
                ) : (
                    <p>Nu există cursuri disponibile.</p>
                )}
            </div>
        </div>
    );
};

export default Administrator;