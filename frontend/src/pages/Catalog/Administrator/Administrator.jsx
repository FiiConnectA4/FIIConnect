import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Administrator.css';

const Administrator = () => {
    const [grupe, setGrupe] = useState([]);
    const [selectedGrupa, setSelectedGrupa] = useState('');
    const [cursuri, setCursuri] = useState([]);
    const [selectedCursId, setSelectedCursId] = useState(null);
    const [catalog, setCatalog] = useState([]);
    const [loading, setLoading] = useState(false);
    const [editingIndex, setEditingIndex] = useState(null);
    const [editedGrade, setEditedGrade] = useState('');
    const [prevGrade, setPrevGrade] = useState('');
    const [gaussResults, setGaussResults] = useState([]);
    const token = localStorage.getItem('token');
    const navigate = useNavigate();


    useEffect(() => {
        fetch('/didactic/course', { headers: { 'Authorization': `Bearer ${token}` } })
            .then(res => res.json())
            .then(data => {
                const courseList = data._embedded?.courseList || [];
                setCursuri(courseList);
                if (courseList.length) setSelectedCursId(courseList[0].id);
            });
    }, [token]);

    useEffect(() => {
        if (!selectedCursId) return;
        loadCatalog(selectedCursId, selectedGrupa);
    }, [selectedCursId, selectedGrupa]);

    const loadCatalog = async (cursId, grupa) => {
        setLoading(true);
        try {
            const [enrollments, grades] = await Promise.all([
                fetch(`/didactic/course/${cursId}/enrolled`, { headers: { 'Authorization': `Bearer ${token}` } }).then(res => res.json()),
                fetch(`/didactic/course/${cursId}/grades`, { headers: { 'Authorization': `Bearer ${token}` } }).then(res => res.json())
            ]);

            const groups = [...new Set(enrollments.map(e => e.student.facultyGroup))];
            setGrupe(groups);
            if (!grupa && groups.length) setSelectedGrupa(groups[0]);

            const groupStudents = enrollments.filter(e => e.student.facultyGroup === (grupa || groups[0])).map(e => e.student);
            const list = groupStudents.map(student => {
                const grade = grades.find(g => g.student.id === student.id);
                return { name: `${student.firstName} ${student.lastName}`, grade: grade ? grade.value : '', studentId: student.id };
            });

            setCatalog(list);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveGrade = async (index) => {
        const gradeEntry = catalog[index];
        const parsed = parseFloat(editedGrade);
        if (isNaN(parsed) || parsed < 1 || parsed > 10) return alert("Nota invalidă");

        const method = gradeEntry.grade ? 'PUT' : 'POST';
        const payload = {
            id: { idStud: gradeEntry.studentId, idCourse: selectedCursId },
            value: parsed,
            gradingDate: new Date().toISOString()
        };

        const res = await fetch('/didactic/grade', {
            method,
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify(payload)
        });
        if (!res.ok) return alert("Eroare la salvare");

        const updated = [...catalog];
        updated[index].grade = parsed;
        setCatalog(updated);
        setEditingIndex(null);
    };

    const handleApplyGauss = async () => {
        if (!selectedCursId) {
            alert("Selectează un curs mai întâi.");
            return;
        }

        try {
            const gradesRes = await fetch(`/didactic/course/${selectedCursId}/grades`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!gradesRes.ok) {
                const text = await gradesRes.text();
                throw new Error(`Nu s-au putut obține notele: ${text}`);
            }

            const grades = await gradesRes.json();

            // Eliminăm câmpurile inutile
            const cleanedGrades = grades.map(g => ({
                id: g.id,
                value: g.value,
                gradingDate: g.gradingDate
            }));

            const response = await fetch(`/didactic/formula/gauss`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(cleanedGrades)
            });

            if (!response.ok) {
                const errText = await response.text();
                throw new Error(`Eroare server la aplicarea Gauss: ${errText}`);
            }

            const gaussGrades = await response.json();

            const transformed = gaussGrades.map(g => {
                const existing = catalog.find(c => c.studentId === g.id.idStud);
                return {
                    studentId: g.id.idStud,
                    value: g.value,
                    name: existing?.name ?? `Student ${g.id.idStud}`
                };
            });

            setCatalog(prev =>
                prev.map(entry => {
                    const updated = gaussGrades.find(g => g.id.idStud === entry.studentId);
                    return updated ? { ...entry, grade: updated.value } : entry;
                })
            );

            setGaussResults(transformed);
            alert(`Distribuția Gauss a fost aplicată cu succes la ${transformed.length} studenți.`);
        } catch (err) {
            console.error("Eroare la aplicarea Gauss:", err);
            alert("Eroare la aplicarea Gauss: " + err.message);
        }
    };

    return (
        <div className="container-catalog">
            <div className="catalog-header">
                <h1>CATALOG</h1>
                <div className="select-controls">
                    <select value={selectedGrupa} onChange={e => setSelectedGrupa(e.target.value)}>
                        {grupe.map((g, i) => <option key={i} value={g}>{g}</option>)}
                    </select>
                    <select value={selectedCursId || ''} onChange={e => setSelectedCursId(parseInt(e.target.value))}>
                        {cursuri.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                    </select>
                </div>
            </div>

            <div className="catalog-table">
                <table>
                    <thead>
                    <tr>
                        <th>Student</th>
                        <th>Nota finală</th>
                        <th>Acțiuni</th>
                    </tr>
                    </thead>
                    <tbody>
                    {loading ? (
                        <tr><td colSpan="3">Loading...</td></tr>
                    ) : (
                        catalog.map((item, idx) => (
                            <tr key={idx}>
                                <td>{item.name}</td>
                                <td>
                                    {editingIndex === idx ? (
                                        <input value={editedGrade} onChange={e => setEditedGrade(e.target.value)} />
                                    ) : (
                                        item.grade
                                    )}
                                </td>
                                <td>
                                    {editingIndex === idx ? (
                                        <>
                                            <button onClick={() => handleSaveGrade(idx)}>💾</button>
                                            <button onClick={() => setEditingIndex(null)}>↩️</button>
                                        </>
                                    ) : (
                                        <>
                                            <button onClick={() => {
                                                setEditedGrade(item.grade);
                                                setEditingIndex(idx);
                                            }}>✏️</button>
                                            <button onClick={() => navigate(`/app/catalog/activity-sheet/${selectedCursId}/${item.studentId}`)}>📋</button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>

            <div className="catalog-buttons">
                <button
                    onClick={() => navigate(`/app/catalog/activity-sheet/group/${selectedCursId}?grupa=${encodeURIComponent(selectedGrupa)}`)}
                    disabled={!selectedCursId || !selectedGrupa}
                >
                    🧾 Fișa de activitate — grupă curentă
                </button>
                <button onClick={handleApplyGauss} disabled={!selectedCursId}>
                    📊 Aplică Gauss
                </button>
            </div>

            {/* Afișare rezultate Gauss */}
            {gaussResults && gaussResults.length > 0 && (
                <div className="catalog-table" style={{ marginTop: '2rem' }}>
                    <h2>Note după Gauss (simulate)</h2>
                    <table>
                        <thead>
                        <tr>
                            <th>Student</th>
                            <th>Notă scalată</th>
                        </tr>
                        </thead>
                        <tbody>
                        {gaussResults.map((g, i) => (
                            <tr key={i}>
                                <td>{g.name}</td>
                                <td>{g.value}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default Administrator;