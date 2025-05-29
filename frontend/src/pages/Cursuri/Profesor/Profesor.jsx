import { useState, useEffect } from 'react';
import Ceas from './../Components/Ceas';
import Carte from '../Components/Carte';
import Buton from '../Components/Buton';
import PageControl from '../Components/PageControl';
import './../Student/Student.css';
import PDetaliiCurs from '../DetaliiCurs/DetaliiCursEditabil';
import PAdaugaCurs from '../DetaliiCurs/PAdaugaCurs';

const Profesor = () => {
    const [professorId, setProfessorId] = useState(null);
    const [professor, setProfessor] = useState(null);
    const [courses, setCourses] = useState([]);
    const [selectedCourseId, setSelectedCourseId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [adaugaCurs, setAdaugaCurs] = useState(false);

    const token = localStorage.getItem('token');

    const fetchCourses = (id) => {
        setLoading(true);
        fetch(`/didactic/professor/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then((res) => {
                if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
                return res.json();
            })
            .then((data) => {
                setProfessor(data);
                setCourses(data.courses || []);
            })
            .catch((err) => {
                console.error('⛔ Eroare la încărcarea datelor:', err);
                setCourses([]);
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        if (!token) {
            console.error("⛔ Token not found");
            setLoading(false);
            return;
        }

        fetch('/person/me', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(res => {
                if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
                return res.json();
            })
            .then(user => {
                const id = user?.professor?.id;
                if (!id) throw new Error("⛔ professorId not found in /person/me response");
                setProfessorId(id);
                fetchCourses(id);
            })
            .catch(err => {
                console.error("⛔ Eroare la obținerea profesorului:", err);
                setLoading(false);
            });
    }, []);

    const handleDeleteCourse = (id) => {
        if (!window.confirm("Ești sigur că vrei să ștergi acest curs?")) return;

        fetch(`/didactic/course/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then((res) => {
                if (!res.ok) throw new Error('Eroare la ștergere');
                setCourses(prev => prev.filter(c => c.course.id !== id));
            })
            .catch((err) => {
                console.error('⛔ Eroare la ștergerea cursului:', err);
                alert('Nu s-a putut șterge cursul.');
            });
    };

    const handleToggleArchiveCourse = (id, currentArchived) => {
        const isArchiving = currentArchived === 0;
        const confirmText = isArchiving
            ? "Ești sigur că vrei să arhivezi acest curs?"
            : "Ești sigur că vrei să dezarhivezi acest curs?";

        if (!window.confirm(confirmText)) return;

        const url = isArchiving
            ? `/didactic/course/${id}/archive`
            : `/didactic/course/${id}`;

        const method = 'PUT';
        const headers = {
            'Authorization': `Bearer ${token}`,
            ...(isArchiving ? {} : { 'Content-Type': 'application/json' })
        };
        const body = isArchiving
            ? null
            : JSON.stringify({ ...courses.find(c => c.course.id === id).course, archived: 0 });

        fetch(url, { method, headers, ...(body && { body }) })
            .then((res) => {
                if (!res.ok) throw new Error('Eroare la arhivare/dezarhivare');
                setCourses(prev =>
                    prev.map(c =>
                        c.course.id === id
                            ? { ...c, course: { ...c.course, archived: isArchiving ? 1 : 0 } }
                            : c
                    )
                );
            })
            .catch((err) => {
                console.error('⛔ Arhivare/Dezarhivare eșuată:', err);
                alert('Operația nu a putut fi realizată.');
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
                    fetchCourses(professorId); // ✅ Actualizează lista
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
                    courses.map(({ course }) => (
                        <div key={course.id} className="rand-curs">
                            <Carte id={course.id} userType='professor' />
                            <Ceas />
                            <Buton
                                text={course.title || 'Titlu indisponibil'}
                                onNavigate={() => setSelectedCourseId(course.id)}
                                className={course.archived === 1 ? 'buton-arhivat' : ''}
                            />
                            <PageControl
                                onDelete={() => handleDeleteCourse(course.id)}
                                onArchive={() => handleToggleArchiveCourse(course.id, course.archived)}
                                archived={course.archived}
                            />
                        </div>
                    ))
                ) : (
                    <p>Nu există cursuri disponibile pentru acest profesor.</p>
                )}

                <Buton text="Adaugă curs" onNavigate={() => setAdaugaCurs(true)} />
            </div>
        </div>
    );
};

export default Profesor;
