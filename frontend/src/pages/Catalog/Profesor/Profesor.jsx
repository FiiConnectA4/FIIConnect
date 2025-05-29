import { useEffect, useState } from 'react';
import './Profesor.css';

const Profesor = () => {
    const [profesorId, setProfesorId] = useState(null);

    const [cursuri, setCursuri] = useState([]);
    const [selectedCursId, setSelectedCursId] = useState(null);

    const [grupe, setGrupe] = useState([]);
    const [selectedGrupa, setSelectedGrupa] = useState('');

    const [catalog, setCatalog] = useState([]);
    const [loading, setLoading] = useState(false);

    const token = localStorage.getItem("token");

    // ✅ Fetch /person/me to get profesorId
    useEffect(() => {
        fetch('/person/me', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(res => res.json())
            .then(data => {
                if (data.role === "ROLE_PROFESOR" && data.professor?.id) {
                    setProfesorId(data.professor.id);
                } else {
                    console.error("Nu s-a putut obține profesorId.");
                }
            })
            .catch(err => console.error("Eroare la fetch /person/me:", err));
    }, []);

    // ✅ Fetch courses by profesorId
    useEffect(() => {
        if (!profesorId) return;

        fetch(`/didactic/professor/${profesorId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(res => res.json())
            .then(data => {
                const courses = (data.courses || [])
                    .map(c => c.course)
                    .filter(c => c.archived !== 1);
                setCursuri(courses);
                if (courses.length > 0) setSelectedCursId(courses[0].id);
            })
            .catch(err => console.error("Eroare la încărcarea cursurilor:", err));
    }, [profesorId]);

    // ✅ Fetch catalog for selected course
    useEffect(() => {
        if (!selectedCursId) return;

        setLoading(true);
        fetch(`/didactic/course/${selectedCursId}/grades`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(res => res.json())
            .then(data => {
                const allGroups = [...new Set(data.map(entry => entry.student.facultyGroup))];
                setGrupe(allGroups);
                if (!selectedGrupa && allGroups.length > 0) {
                    setSelectedGrupa(allGroups[0]);
                }

                const filtered = data
                    .filter(entry => entry.student.facultyGroup === selectedGrupa)
                    .map(entry => ({
                        name: `${entry.student.firstName} ${entry.student.lastName}`,
                        grade: entry.value
                    }));

                setCatalog(filtered);
                setLoading(false);
            })
            .catch(err => {
                console.error("Eroare la încărcarea catalogului:", err);
                setLoading(false);
            });
    }, [selectedCursId, selectedGrupa]);

    return (
        <div className="container-catalog">
            <div className="catalog-header">
                <h1>CATALOG</h1>
                <div className="select-controls">
                    <select value={selectedGrupa} onChange={e => setSelectedGrupa(e.target.value)}>
                        {grupe.map((g, i) => (
                            <option key={i} value={g}>{g}</option>
                        ))}
                    </select>

                    <select value={selectedCursId ?? ''} onChange={e => setSelectedCursId(parseInt(e.target.value))}>
                        {cursuri.map((c) => (
                            <option key={c.id} value={c.id}>{c.title}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="catalog-table">
                <table>
                    <thead>
                    <tr className='titlu'>
                        <th>Nume student</th>
                        <th>Titlu curs</th>
                        <th>Nota finală</th>
                        <th>Administrative Note</th>
                    </tr>
                    </thead>
                    <tbody>
                    {loading ? (
                        <tr><td colSpan="4">Se încarcă...</td></tr>
                    ) : catalog.length === 0 ? (
                        <tr><td colSpan="4">Nicio înregistrare.</td></tr>
                    ) : (
                        catalog.map((item, index) => (
                            <tr key={index}>
                                <td>{item.name}</td>
                                <td>{cursuri.find(c => c.id === selectedCursId)?.title || ''}</td>
                                <td>{item.grade}</td>
                                <td>
                                    <button
                                        className="admin-button"
                                        onClick={() => alert(`Deschide fișa pentru ${item.name}`)}
                                    >
                                        <img
                                            src="/icons/edit-icon.png"
                                            alt="Admin Note"
                                            className="icon-img"
                                        />
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Profesor;
