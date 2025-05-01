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
    const professorId = searchParams.get('professorId') || 5;
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
                console.log('Răspuns API:', data); // Verifică structura datelor
                setProfessor(data); // Setăm obiectul Professor
                setCourses(data.courses || []); // Setăm cursurile profesorului
                setLoading(false);
            })
            .catch((err) => {
                console.error('Eroare la încărcarea datelor:', err);
                setCourses([]); // Dacă apare o eroare, setăm cursurile ca fiind goale
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
                curs={course.course}
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
                    courses.map((cursuri) => (
                        <div key={cursuri.course.id} className="rand-curs">
                            <Carte />
                            <Ceas />
                            <Buton text={cursuri.course.title || 'Titlu indisponibil'} onNavigate={() => setSelectedCourseId(cursuri.id)} />
                            <PageControl />
                        </div>
                    ))
                ) : (
                    <p>Nu există cursuri disponibile pentru acest profesor.</p>
                )}
                <Buton text='Adauga curs' />
            </div>
        </div>
    );
};
export default Profesor;
