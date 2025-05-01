import { useState, useEffect } from 'react';
import Ceas from './../Components/Ceas';
import Carte from '../Components/Carte';
import Buton from '../Components/Buton';
import PageControl from '../Components/PageControl';
import './../Student/Student.css';
import PDetaliiCurs from '../DetaliiCurs/DetaliiCursEditabil';
import { useSearchParams } from 'react-router-dom';
import PAdaugaCurs from '../DetaliiCurs/PAdaugaCurs';

const Profesor = () => {
    const [searchParams] = useSearchParams();
    const professorId = searchParams.get('professorId') || 8;
    const [professor, setProfessor] = useState(null);
    const [courses, setCourses] = useState([]);
    const [selectedCourseId, setSelectedCourseId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [adaugaCurs, setAdaugaCurs] = useState(false);

    const fetchCourses = () => {
        setLoading(true);
        fetch(`/didactic/professor/${professorId}`)
            .then((res) => {
                if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
                return res.json();
            })
            .then((data) => {
                setProfessor(data);
                setCourses(data.courses || []);
                setLoading(false);
            })
            .catch((err) => {
                console.error('Eroare la încărcarea datelor:', err);
                setCourses([]);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchCourses();
    }, [professorId]);

    const handleDeleteCourse = (id) => {
        if (!window.confirm("Ești sigur că vrei să ștergi acest curs?")) return;

        fetch(`/didactic/course/${id}`, {
            method: 'DELETE'
        })
            .then((res) => {
                if (!res.ok) throw new Error('Eroare la ștergere');
                setCourses(prev => prev.filter(c => c.course.id !== id));
            })
            .catch((err) => {
                console.error('Eroare la ștergerea cursului:', err);
                alert('Nu s-a putut șterge cursul.');
            });
    };

    if (loading) return <div>Loading...</div>;

    if (selectedCourseId) {
        const course = courses.find(c => c.course?.id === selectedCourseId);
        if (!course) {
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

    if (adaugaCurs) {
        return (
            <PAdaugaCurs
                professorId={professorId}
                onBack={() => setAdaugaCurs(false)}
                onCreated={() => {
                    setAdaugaCurs(false);
                    fetchCourses(); // ✅ Actualizează lista fără reload
                }}
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
                    courses.map((cursuri) => {
                        const id = cursuri.course?.id;
                        if (!id) return null;

                        return (
                            <div key={id} className="rand-curs">
                                <Carte />
                                <Ceas />
                                <Buton
                                    text={cursuri.course.title || 'Titlu indisponibil'}
                                    onNavigate={() => setSelectedCourseId(id)}
                                />
                                <PageControl onDelete={() => handleDeleteCourse(id)} />
                            </div>
                        );
                    })
                ) : (
                    <p>Nu există cursuri disponibile pentru acest profesor.</p>
                )}
                <Buton text="Adaugă curs" onNavigate={() => setAdaugaCurs(true)} />
            </div>
        </div>
    );
};

export default Profesor;