import { useState, useEffect } from 'react';
import Ceas from './../Components/Ceas';
import Carte from '../Components/Carte';
import Buton from '../Components/Buton';
import PageControl from '../Components/PageControl';
import './../Student/Student.css';
import PDetaliiCurs from './PDetaliiCurs';
import { useSearchParams } from 'react-router-dom';
const Profesor = () => {
    const [searchParams] = useSearchParams(); // Hook pentru a citi query params
    const professorId = searchParams.get('professorId') || 1;
    const [professor, setProfessor] = useState(null); // Stocăm obiectul Professor
    const [courses, setCourses] = useState([]); // Lista de cursuri (goală momentan)
    const [selectedCourseId, setSelectedCourseId] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`/didactic/professor/${professorId}`)
            .then((res) => {
                if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
                return res.json();
            })
            .then((data) => {
                console.log('Răspuns API:', data); // Verifică ce primești
                setProfessor(data); // Setăm obiectul Professor
                // Dacă backend-ul nu returnează cursuri, setăm un array gol
                // În viitor, aici ai putea seta data.courses dacă devine disponibil
                setCourses([]); 
                setLoading(false);
            })
            .catch((err) => {
                console.error('Eroare la încărcarea datelor:', err);
                setCourses([]);
                setLoading(false);
            });
    }, [professorId]);

    if (loading) return <div>Loading...</div>;

    if (selectedCourseId) {
        const course = courses.find(c => c.id === selectedCourseId);
        if (!course) {
            console.error(`Cursul cu ID ${selectedCourseId} nu a fost găsit`);
            setSelectedCourseId(null);
            return <div>Cursul nu a fost găsit</div>;
        }
        return (
            <PDetaliiCurs
                curs={course}
                onBack={() => setSelectedCourseId(null)}
            />
        );
    }

    return (
        <div className="container-cursuri">
            <div className="cursuri-titlu">
                <h1>Cursurile mele</h1>
                <Ceas />
            </div>
            {professor && (
                <div className="professor-info">
                    <p>Profesor: {professor.firstName} {professor.lastName} ({professor.rank})</p>
                </div>
            )}
            <div className="lista-cursuri">
                {Array.isArray(courses) && courses.length > 0 ? (
                    courses.map((curs) => (
                        <div key={curs.id} className="rand-curs">
                            <Carte />
                            <Buton text={curs.title} onNavigate={() => setSelectedCourseId(curs.id)} />
                        </div>
                    ))
                ) : (
                    <p>Nu există cursuri disponibile pentru acest profesor.</p>
                )}
            </div>
        </div>
    );
};
export default Profesor;
