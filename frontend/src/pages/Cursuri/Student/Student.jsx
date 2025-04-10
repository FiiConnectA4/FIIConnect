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

    useEffect(() => {
        // Fetch courses from the backend API
        fetch('/didactic/course')
            .then(response => response.json())
            .then(data => {
                setCursuri(data._embedded.courses); // Adjust the structure based on your API response
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching courses:', error);
                setLoading(false);
            });
    }, []);

    const an = 2;
    const semestru = 2;

    if (loading) {
        return <div>Loading...</div>;
    }

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
                            text={curs.title}  // Display course title
                            onNavigate={() => setSelectedCursId(curs.id)}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Student;