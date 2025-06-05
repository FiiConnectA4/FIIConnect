import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Profesor.css';

const Profesor = () => {
    const [profesorId, setProfesorId] = useState(null);

    const [cursuri, setCursuri] = useState([]);
    const [selectedCursId, setSelectedCursId] = useState(null);

    const [grupe, setGrupe] = useState([]);
    const [selectedGrupa, setSelectedGrupa] = useState('');

    const [catalog, setCatalog] = useState([]);
    const [loading, setLoading] = useState(false);

    const [editingIndex, setEditingIndex] = useState(null);
    const [editedGrade, setEditedGrade] = useState('');
    const [prevGrade, setPrevGrade] = useState('');
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
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
    useEffect(() => {
        if (!profesorId) return;
        fetch(`/didactic/professor/${profesorId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => {
                const courses = (data.courses || [])
                    .map(c => c.course)
                    .filter(c => c.archived !== 1);
                setCursuri(courses);
                if (courses.length) setSelectedCursId(courses[0].id);
            })
            .catch(err => console.error(err));
    }, [profesorId, token]);
    useEffect(() => {
        if (!selectedCursId) return;
        setLoading(true);
        Promise.all([
            fetch(`/didactic/course/${selectedCursId}/enrolled`, { headers: { 'Authorization': `Bearer ${token}` } }).then(res => res.json()),
            fetch(`/didactic/course/${selectedCursId}/grades`, { headers: { 'Authorization': `Bearer ${token}` } }).then(res => res.json())
        ])
            .then(([enrollments, grades]) => {
                const uniqueGroups = [...new Set(enrollments.map(e => e.student.facultyGroup))];
                setGrupe(uniqueGroups);
                const defaultGroup = uniqueGroups[0] || '';
                setSelectedGrupa(defaultGroup);

                // build initial catalog for default group
                const students = enrollments
                    .filter(e => e.student.facultyGroup === defaultGroup)
                    .map(e => e.student);
                const initCatalog = students.map(student => {
                    const g = grades.find(x => x.student.id === student.id);
                    return { name: `${student.firstName} ${student.lastName}`, grade: g ? g.value : '', studentId: student.id };
                });
                setCatalog(initCatalog);
                setLoading(false);
            })
            .catch(err => { console.error(err); setLoading(false); });
    }, [selectedCursId, token]);

    // Refresh catalog when group changes
    useEffect(() => {
        if (!selectedCursId || !selectedGrupa) return;
        setLoading(true);
        Promise.all([
            fetch(`/didactic/course/${selectedCursId}/enrolled`, { headers: { 'Authorization': `Bearer ${token}` } }).then(res => res.json()),
            fetch(`/didactic/course/${selectedCursId}/grades`, { headers: { 'Authorization': `Bearer ${token}` } }).then(res => res.json())
        ])
            .then(([enrollments, grades]) => {
                const students = enrollments
                    .filter(e => e.student.facultyGroup === selectedGrupa)
                    .map(e => e.student);
                const newCatalog = students.map(student => {
                    const g = grades.find(x => x.student.id === student.id);
                    return { name: `${student.firstName} ${student.lastName}`, grade: g ? g.value : '', studentId: student.id };
                });
                setCatalog(newCatalog);
                setLoading(false);
            })
            .catch(err => { console.error(err); setLoading(false); });
    }, [selectedCursId, selectedGrupa, token]);

    const handleSaveGrade = (index) => {
        const entry = catalog[index];
        if (!entry) return;
        const parsed = parseFloat(editedGrade);
        if (isNaN(parsed) || parsed < 1 || parsed > 10) {
            alert('Nota trebuie să fie între 1 și 10.');
            return;
        }
        const dateNow = new Date().toISOString();
        const hasExisting = entry.grade !== '';
        const method = hasExisting ? 'PUT' : 'POST';
        const payload = hasExisting
            ? {
                id: { idStud: entry.studentId, idCourse: selectedCursId },
                value: parsed
            }
            : {
                id: { idStud: entry.studentId, idCourse: selectedCursId },
                value: parsed,
                gradingDate: dateNow
            };

        fetch('/didactic/grade', {
            method,
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify(payload)
        })
            .then(res => {
                if (!res.ok) throw new Error(`Eroare ${method}`);
                const updated = [...catalog]; updated[index].grade = parsed;
                setCatalog(updated);
                setEditingIndex(null);
            })
            .catch(err => { console.error(err); alert('Eroare salvare nota: ' + err.message); });
    };

    const handleUndo = () => {
        setEditedGrade(prevGrade);
        setEditingIndex(null);
    };

    const handleUploadExcel = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.csv';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const formData = new FormData();
            formData.append('file', file);

            fetch(`/didactic/course/${selectedCursId}/upload_csv`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            })
                .then(res => {
                    if (!res.ok) throw new Error('Eroare la încărcarea fișierului CSV');
                    // Check if response has content before parsing JSON
                    const contentType = res.headers.get('content-type');
                    if (contentType && contentType.includes('application/json')) {
                        return res.json();
                    }
                    return null; // Return null if no JSON content
                })
                .then(data => {
                    alert('Fișierul CSV a fost încărcat cu succes!');
                    // Refresh the catalog to show updated grades
                    setSelectedGrupa(selectedGrupa); // This will trigger the useEffect to reload data
                })
                .catch(err => {
                    console.error(err);
                    alert('Eroare la încărcarea fișierului CSV: ' + err.message);
                });
        };
        input.click();
    };

    const currentCourseTitle = cursuri.find(c => c.id === selectedCursId)?.title || '';

    return (
        <div className="container-catalog">
            <div className="catalog-header">
                <h1>CATALOG</h1>
                <div className="select-controls">
                    <select value={selectedGrupa} onChange={e => setSelectedGrupa(e.target.value)}>
                        {grupe.map((g, i) => <option key={i} value={g}>{g}</option>)}
                    </select>
                    <select value={selectedCursId || ''} onChange={e => setSelectedCursId(parseInt(e.target.value, 10))}>
                        {cursuri.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                    </select>
                </div>
            </div>
            <div className="catalog-table">
                <table>
                    <thead>
                        <tr className="titlu">
                            <th>Nume student</th>
                            <th>{`Titlu curs`}</th>
                            <th>Nota finală</th>
                            <th>Administrare</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading && <tr><td colSpan="4">Se încarcă...</td></tr>}
                        {!loading && catalog.length === 0 && <tr><td colSpan="4">Nicio înregistrare.</td></tr>}
                        {!loading && catalog.map((item, idx) => (
                            <tr key={idx}>
                                <td>{item.name}</td>
                                <td>{currentCourseTitle}</td>
                                <td>{editingIndex === idx ? (
                                    <input type="number" value={editedGrade} onChange={e => setEditedGrade(e.target.value)} />
                                ) : item.grade}</td>
                                <td>
                                    {editingIndex === idx ? (
                                        <>
                                            <button onClick={() => handleSaveGrade(idx)}>💾</button>
                                            <button onClick={handleUndo}>↩️</button>
                                        </>
                                    ) : (
                                        <button onClick={() => { setPrevGrade(item.grade); setEditingIndex(idx); setEditedGrade(item.grade); }}>✏️</button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="catalog-buttons">
                <button onClick={handleUploadExcel}>Încarcă CSV</button>
                <button onClick={() => navigate(`/app/catalog/activity-sheet/${c.courseId}`)}>
                    <img src="/icons/edit-icon.png" alt="Fișa activitate" className="icon-img" />
                </button>
            </div>
        </div>
    );
};

export default Profesor;