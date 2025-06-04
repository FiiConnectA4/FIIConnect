import { useState, useEffect } from 'react';
import Buton from '../Components/Buton';
import Carte from '../Components/Carte';
import Ceas from '../Components/Ceas';
import './../Student/Student.css';
import PDetaliiCurs from '../DetaliiCurs/DetaliiCursEditabil';
import PageControl from '../Components/PageControl';
import AdaugaCurs from '../DetaliiCurs/AdaugaCurs';
import { useNavigate } from 'react-router-dom';

const Administrator = () => {
    const [selectedCursId, setSelectedCursId] = useState(null);
    const [cursuri, setCursuri] = useState([]);
    const [loading, setLoading] = useState(true);
    const [adaugaCurs, setAdaugaCurs] = useState(false);
    const [feedbackEnabled, setFeedbackEnabled] = useState(false);
    const navigate = useNavigate();

    const token = localStorage.getItem('token');

    useEffect(() => {
        fetchCourses();
        fetchFeedbackStatus();
    }, []);

    const fetchCourses = () => {
        setLoading(true);
        fetch('/didactic/course', {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => {
                if (!res.ok) throw new Error(`Eroare HTTP: ${res.status}`);
                return res.json();
            })
            .then((data) => {
                const courseList = data._embedded?.courseList || [];
                setCursuri(courseList);
            })
            .catch((err) => {
                console.error('Eroare la încărcarea cursurilor:', err);
                setCursuri([]);
            })
            .finally(() => setLoading(false));
    };

    const fetchFeedbackStatus = () => {
        fetch('/didactic/globals/feedbacksAllowed', {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(res => res.json())
            .then(data => {
                const enabled = data?.value === "true";
                setFeedbackEnabled(enabled);
            })
            .catch(err => {
                console.error("Eroare la citirea statusului feedback:", err);
            });
    };

    const handleToggleFeedback = () => {
        const newValue = !feedbackEnabled;
        fetch(`/didactic/globals/feedbacksAllowed?value=${newValue}`, {
            method: 'PUT',
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => {
                if (!res.ok) throw new Error("Eroare la activare feedback");
                return res.json(); // backendul returnează obiectul GlobalConstant
            })
            .then((data) => {
                // confirmă că valoarea a fost actualizată
                setFeedbackEnabled(data.value === "true");
            })
            .catch((err) => {
                console.error("Eroare la modificarea feedback:", err);
                alert("Nu s-a putut modifica statusul feedback-ului.");
            });
    };

    const handleDeleteCourse = (id) => {
        if (!window.confirm("Ești sigur că vrei să ștergi acest curs?")) return;
        fetch(`/didactic/course/${id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => {
                if (!res.ok) throw new Error("Eroare la ștergere");
                setCursuri((prev) => prev.filter((c) => c.id !== id));
            })
            .catch((err) => {
                console.error("Eroare la ștergere:", err);
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
            fetch(`/didactic/course/${id}/archive`, {
                method: 'PUT',
                headers: { Authorization: `Bearer ${token}` },
            })
                .then((res) => {
                    if (!res.ok) throw new Error("Eroare la arhivare");
                    setCursuri((prev) =>
                        prev.map((c) => (c.id === id ? { ...c, archived: 1 } : c))
                    );
                })
                .catch((err) => {
                    console.error("Arhivare eșuată:", err);
                    alert("Nu s-a putut arhiva cursul.");
                });
        } else {
            const curs = cursuri.find((c) => c.id === id);
            if (!curs) return alert("Cursul nu a fost găsit local.");

            fetch(`/didactic/course/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ ...curs, archived: 0 }),
            })
                .then((res) => {
                    if (!res.ok) throw new Error("Eroare la dezarhivare");
                    setCursuri((prev) =>
                        prev.map((c) => (c.id === id ? { ...c, archived: 0 } : c))
                    );
                })
                .catch((err) => {
                    console.error("Dezarhivare eșuată:", err);
                    alert("Nu s-a putut dezarhiva cursul.");
                });
        }
    };

    if (loading) return <div>Se încarcă lista de cursuri...</div>;

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
                <div className="feedback-switch">
                    <label>
                        <input
                            type="checkbox"
                            checked={feedbackEnabled}
                            onChange={handleToggleFeedback}
                        />
                        Feedback Activ
                    </label>
                </div>
                <Ceas onClick={() => navigate('/app/orar')} />
            </div>

            <div className="lista-cursuri">
                {cursuri.length > 0 ? (
                    cursuri.map((curs) => (
                        <div
                            key={curs.id}
                            className={`rand-curs ${curs.archived === 1 ? 'archived-course' : ''}`}
                        >
                            <Carte id={curs.id} userType="professor" />
                            <Buton
                                text={curs.title}
                                onNavigate={() => setSelectedCursId(curs.id)}
                                className={curs.archived === 1 ? 'buton-arhivat' : ''}
                            />
                            <Ceas
                                onClick={() =>
                                    navigate(`/app/orar/discipline/${encodeURIComponent(curs.title)}`)
                                }
                            />
                            <PageControl
                                id={curs.id}
                                title={curs.title}
                                description={curs.description}
                                professorId={curs.professorId}
                                onDelete={() => handleDeleteCourse(curs.id)}
                                onArchive={() =>
                                    handleToggleArchiveCourse(curs.id, curs.archived)
                                }
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