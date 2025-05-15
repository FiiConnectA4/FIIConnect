import { useState, useEffect } from 'react';
import Buton from '../Components/Buton';
import Carte from '../Components/Carte';
import Ceas from '../Components/Ceas';
import './../Student/Student.css';
import PDetaliiCurs from '../DetaliiCurs/DetaliiCursEditabil';
import PageControl from '../Components/PageControl';
import AdaugaCurs from '../DetaliiCurs/AdaugaCurs';

const Administrator = () => {
    const [selectedCursId, setSelectedCursId] = useState(null);
    const [cursuri, setCursuri] = useState([]);
    const [loading, setLoading] = useState(true);
    const [adaugaCurs, setAdaugaCurs] = useState(false);

    const fetchCourses = () => {
    const token = localStorage.getItem('token'); 

    setLoading(true);
    fetch('/didactic/course', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then((response) => {
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        return response.json();
    })
    .then((data) => {
        const courses = data._embedded?.courses || [];
        setCursuri(courses);
        setLoading(false);
    })
    .catch((error) => {
        console.error('Eroare la încărcarea cursurilor:', error);
        setCursuri([]);
        setLoading(false);
    });
};

    useEffect(() => {
        fetchCourses();
    }, []);

    const handleDeleteCourse = (id) => {
        if (!window.confirm("Ești sigur că vrei să ștergi acest curs?")) return;
        fetch(`/didactic/course/${id}`, {
            method: 'DELETE'
        })
            .then((res) => {
                if (!res.ok) throw new Error("Eroare la ștergere");
                setCursuri(prev => prev.filter(c => c.id !== id));
            })
            .catch((err) => {
                console.error("⛔ Eroare la ștergerea cursului:", err);
                alert("Nu s-a putut șterge cursul.");
            });
    };

    const handleToggleArchiveCourse = (id, currentArchived) => {
        const isArchiving = currentArchived === 0;
        const confirmText = isArchiving
            ? "Ești sigur că vrei să arhivezi acest curs?"
            : "Ești sigur că vrei să dezarhivezi acest curs?";

        if (!window.confirm(confirmText)) return;

        if (isArchiving) {
            // apelăm direct endpointul de arhivare simplă
            fetch(`/didactic/course/${id}/archive`, {
                method: 'PUT'
            })
                .then((res) => {
                    if (!res.ok) throw new Error("Eroare la arhivare");
                    setCursuri(prev =>
                        prev.map(c => c.id === id ? { ...c, archived: 1 } : c)
                    );
                })
                .catch((err) => {
                    console.error("⛔ Arhivare eșuată:", err);
                    alert("Nu s-a putut arhiva cursul.");
                });
        } else {
            // trimitem întreg obiectul cursului cu archived = 0
            const curs = cursuri.find(c => c.id === id);
            if (!curs) {
                alert("Cursul nu a fost găsit local.");
                return;
            }

            const updatedCurs = {
                ...curs,
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
                    setCursuri(prev =>
                        prev.map(c => c.id === id ? { ...c, archived: 0 } : c)
                    );
                })
                .catch((err) => {
                    console.error("⛔ Dezarhivare eșuată:", err);
                    alert("Nu s-a putut dezarhiva cursul.");
                });
        }
    };

    if (loading) return <div>Loading...</div>;

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

    if (adaugaCurs) {
        return (
            <AdaugaCurs
                onBack={() => setAdaugaCurs(false)}
                onCreated={() => {
                    setAdaugaCurs(false);
                    fetchCourses();
                }}
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
                        <div key={curs.id} className={`rand-curs ${curs.archived === 1 ? 'archived-course' : ''}`}>
                            <Carte
                                key={curs.id}
                                id={curs.id}
                                userType='professor'
                            />
                            <Ceas idCurs={curs.id} />
                            <Buton
                                text={curs.title}
                                onNavigate={() => setSelectedCursId(curs.id)}
                                className={curs.archived === 1 ? 'buton-arhivat' : ''}
                            />
                            <PageControl
                                id={curs.id}
                                title={curs.title}
                                description={curs.description}
                                professorId={curs.professorId}
                                onDelete={() => handleDeleteCourse(curs.id)}
                                onArchive={() => handleToggleArchiveCourse(curs.id, curs.archived)}
                            />
                        </div>
                    ))
                ) : (
                    <p>Nu există cursuri disponibile.</p>
                )}
                <Buton text="Adaugă curs" onNavigate={() => setAdaugaCurs(true)} />
            </div>
        </div>
    );
};

export default Administrator;