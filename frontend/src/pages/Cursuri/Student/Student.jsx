import { useState, useEffect } from 'react';
import Ceas from '../Components/Ceas';
import Carte from '../Components/Carte';
import Buton from '../Components/Buton';
import './Student.css';
import DetaliiCurs from './DetaliiCurs';
const Student = () => {
    const [selectedCursId, setSelectedCursId] = useState(null);
    const [cursuri, setCursuri] = useState([]);
    const [loading, setLoading] = useState(true);

    const an = 2; // Year
    const semestru = 2; // Semester

    useEffect(() => {
        // Update the fetch URL to include year and semester
        fetch(`/didactic/courses/${an}/${semestru}`)
            .then((response) => {
                if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
                return response.json();
            })
            .then((data) => {
                console.log('Răspuns API:', data);
                // Adjust based on the actual response structure from your API
                const courses = data._embedded?.courseList || data || [];
                setCursuri(Array.isArray(courses) ? courses : []);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Eroare la încărcarea cursurilor:', error);
                setCursuri([]);
                setLoading(false);
            });
    }, [an, semestru]); // Add dependencies to re-fetch if year or semester changes

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
            <DetaliiCurs
                curs={cursSelectat}
                onBack={() => setSelectedCursId(null)}
            />
        );
    }

    return (
        <div className="container-cursuri">
            <div className="cursuri-titlu">
                <h1>Cursuri</h1>
                <h2>Anul {an} semestrul {semestru}</h2>
                <Ceas />
            </div>
            <div className="lista-cursuri">
                {cursuri.length > 0 ? (
                    cursuri.map((curs) => (
                        <div key={curs.id} className="rand-curs">
                            <Carte />
                            <Ceas />
                            <Buton
                                text={curs.title}
                                onNavigate={() => setSelectedCursId(curs.id)}
                            />
                        </div>
                    ))
                ) : (
                    <p>Nu există cursuri disponibile.</p>
                )}
            </div>
        </div>
    );
};

export default Student;
