import { useEffect, useState } from 'react';
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

    const token = localStorage.getItem('token');

    useEffect(() => {
        fetch('/didactic/course', { headers: { 'Authorization': `Bearer ${token}` } })
            .then(res => res.json())
            .then(data => {
                const courseList = data._embedded?.courseList || [];
                setCursuri(courseList);
                if (courseList.length) setSelectedCursId(courseList[0].id);
            })
            .catch(err => console.error('Eroare la încărcarea cursurilor:', err));
    }, [token]);

    useEffect(() => {
        if (!selectedCursId) return;
        setLoading(true);
        Promise.all([
            fetch(`/didactic/course/${selectedCursId}/enrolled`, { headers: { 'Authorization': `Bearer ${token}` } }).then(res => res.json()),
            fetch(`/didactic/course/${selectedCursId}/grades`, { headers: { 'Authorization': `Bearer ${token}` } }).then(res => res.json())
        ])
            .then(([enrollments, grades]) => {
                const allGroups = [...new Set(enrollments.map(e => e.student.facultyGroup))];
                setGrupe(allGroups);
                const defaultGroup = allGroups[0] || '';
                setSelectedGrupa(defaultGroup);

                const groupStudents = enrollments
                    .filter(e => e.student.facultyGroup === defaultGroup)
                    .map(e => e.student);

                const initialCatalog = groupStudents.map(student => {
                    const gradeEntry = grades.find(g => g.student.id === student.id);
                    return {
                        name: `${student.firstName} ${student.lastName}`,
                        grade: gradeEntry ? gradeEntry.value : '',
                        studentId: student.id
                    };
                });

                setCatalog(initialCatalog);
                setLoading(false);
            })
            .catch(err => { console.error('Eroare la încărcarea datelor:', err); setLoading(false); });
    }, [selectedCursId, token]);

    useEffect(() => {
        if (!selectedCursId || !selectedGrupa) return;
        setLoading(true);
        Promise.all([
            fetch(`/didactic/course/${selectedCursId}/enrolled`, { headers: { 'Authorization': `Bearer ${token}` } }).then(res => res.json()),
            fetch(`/didactic/course/${selectedCursId}/grades`, { headers: { 'Authorization': `Bearer ${token}` } }).then(res => res.json())
        ])
            .then(([enrollments, grades]) => {
                const groupStudents = enrollments
                    .filter(e => e.student.facultyGroup === selectedGrupa)
                    .map(e => e.student);

                const filteredCatalog = groupStudents.map(student => {
                    const gradeEntry = grades.find(g => g.student.id === student.id);
                    return {
                        name: `${student.firstName} ${student.lastName}`,
                        grade: gradeEntry ? gradeEntry.value : '',
                        studentId: student.id
                    };
                });

                setCatalog(filteredCatalog);
                setLoading(false);
            })
            .catch(err => { console.error('Eroare la fetch:', err); setLoading(false); });
    }, [selectedCursId, selectedGrupa, token]);

    const handleSaveGrade = (index) => {
        const gradeEntry = catalog[index];
        if (!gradeEntry) return;

        const studentId = gradeEntry.studentId;
        const courseId = selectedCursId;

        const parsedGrade = parseFloat(editedGrade);
        if (isNaN(parsedGrade) || parsedGrade < 1 || parsedGrade > 10) {
            alert("Introduceți o notă validă între 1 și 10.");
            return;
        }

        fetch(`/didactic/grade?idStud=${studentId}&idCourse=${courseId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(res => {
                if (!res.ok) return res.text().then(text => { throw new Error(text); });
                return fetch('/didactic/grade', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ value: parsedGrade, student: { id: studentId }, course: { id: courseId } })
                });
            })
            .then(res => {
                if (!res.ok) return res.text().then(text => { throw new Error(text); });
                const updated = [...catalog];
                updated[index].grade = parsedGrade;
                setCatalog(updated);
                setEditingIndex(null);
            })
            .catch(err => { console.error(err); alert("Eroare la actualizarea notei."); });
    };

    const handleUndo = () => {
        setEditedGrade(prevGrade);
        setEditingIndex(null);
    };

    return (
        <div className="container-catalog">
            <div className="catalog-header">
                <h1>CATALOG</h1>
                <div className="select-controls">
                    <select value={selectedGrupa} onChange={e => setSelectedGrupa(e.target.value)}>
                        {grupe.map((g, i) => (<option key={i} value={g}>{g}</option>))}
                    </select>
                    <select value={selectedCursId || ''} onChange={e => setSelectedCursId(parseInt(e.target.value, 10))}>
                        {cursuri.map(c => (<option key={c.id} value={c.id}>{c.title}</option>))}
                    </select>
                </div>
            </div>

            <div className="catalog-table">
                <table>
                    <thead>
                        <tr className='titlu'>
                            <th><input type="checkbox" /></th>
                            <th>Student Name</th>
                            <th>Titlu Curs</th>
                            <th>Nota finală</th>
                            <th>Administrative Note</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="5">Se încarcă...</td></tr>
                        ) : catalog.length === 0 ? (
                            <tr><td colSpan="5">Nicio înregistrare pentru grupa selectată.</td></tr>
                        ) : (
                            catalog.map((item, idx) => (
                                <tr key={idx}>
                                    <td><input type="checkbox" /></td>
                                    <td>{item.name}</td>
                                    <td>{cursuri.find(c => c.id === selectedCursId)?.title || ''}</td>
                                    <td>
                                        {editingIndex === idx ? (
                                            <input type="number" value={editedGrade} onChange={e => setEditedGrade(e.target.value)} />
                                        ) : (
                                            item.grade
                                        )}
                                    </td>
                                    <td>
                                        {editingIndex === idx ? (
                                            <>
                                                <button onClick={() => handleSaveGrade(idx)}>💾</button>
                                                <button onClick={handleUndo}>↩️</button>
                                            </>
                                        ) : (
                                            <button onClick={() => { setPrevGrade(item.grade); setEditingIndex(idx); setEditedGrade(item.grade); }}>
                                                ✏️
                                            </button>
                                        )}
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

export default Administrator;