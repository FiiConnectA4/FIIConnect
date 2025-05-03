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
    const [searchParams] = useSearchParams(); // Hook pentru a citi query params
    const professorId = searchParams.get('professorId') || 2;
    const [professor, setProfessor] = useState(null); // Stocăm obiectul Professor
    const [courses, setCourses] = useState([]); // Lista de cursuri (goală momentan)
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

    const handleToggleArchiveCourse = (id, currentArchived) => {
        const isArchiving = currentArchived === 0;
        const confirmText = isArchiving
            ? "Ești sigur că vrei să arhivezi acest curs?"
            : "Ești sigur că vrei să dezarhivezi acest curs?";

        if (!window.confirm(confirmText)) return;

        if (isArchiving) {
            fetch(`/didactic/course/${id}/archive`, {
                method: 'PUT'
            })
                .then((res) => {
                    if (!res.ok) throw new Error("Eroare la arhivare");
                    setCourses(prev =>
                        prev.map(c =>
                            c.course?.id === id ? { ...c, course: { ...c.course, archived: 1 } } : c
                        )
                    );
                })
                .catch((err) => {
                    console.error("⛔ Arhivare eșuată:", err);
                    alert("Nu s-a putut arhiva cursul.");
                });
        } else {
            const curs = courses.find(c => c.course?.id === id);
            if (!curs || !curs.course) {
                alert("Cursul nu a fost găsit local.");
                return;
            }

            const updatedCurs = {
                ...curs.course,
                archived: 0
            };

            fetch(`/didactic/course/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedCurs)
            })
                .then((res) => {
                    if (!res.ok) throw new Error("Eroare la dezarhivare");
                    setCourses(prev =>
                        prev.map(c =>
                            c.course?.id === id ? { ...c, course: { ...c.course, archived: 0 } } : c
                        )
                    );
                })
                .catch((err) => {
                    console.error("⛔ Dezarhivare eșuată:", err);
                    alert("Nu s-a putut dezarhiva cursul.");
                });
        }
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
                                <Carte
                                    key={id}
                                    id={id}
                                    userType='professor'
                                />
                                <Ceas />
                                <Buton
                                    text={cursuri.course.title || 'Titlu indisponibil'}
                                    onNavigate={() => setSelectedCourseId(id)}
                                    className={cursuri.course.archived === 1 ? 'buton-arhivat' : ''}
                                />
                                <PageControl
                                    onDelete={() => handleDeleteCourse(id)}
                                    onArchive={() => handleToggleArchiveCourse(id, cursuri.course.archived)}
                                    archived={cursuri.course.archived}
                                />
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