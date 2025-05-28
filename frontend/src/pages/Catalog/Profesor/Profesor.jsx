import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import './Profesor.css';

const Profesor = () => {
    const [searchParams] = useSearchParams();
    const profesorId = searchParams.get('profesorId') || 2;

    const [cursuri, setCursuri] = useState([]);
    const [selectedCursId, setSelectedCursId] = useState(null);

    const [grupe, setGrupe] = useState([]);
    const [selectedGrupa, setSelectedGrupa] = useState('');

    const [gradesData, setGradesData] = useState([]);
    const [catalog, setCatalog] = useState([]);
    const [loading, setLoading] = useState(false);

    const token = localStorage.getItem('token');

    // Load courses
    useEffect(() => {
        if (!profesorId) return;
        fetch(`/didactic/professor/${profesorId}`, { headers: { 'Authorization': `Bearer ${token}` } })
            .then(res => res.json())
            .then(data => {
                const courses = (data.courses || []).map(c => c.course).filter(c => c.archived !== 1);
                setCursuri(courses);
                if (courses.length) setSelectedCursId(courses[0].id);
            })
            .catch(err => console.error(err));
    }, [profesorId, token]);

    // Load groups when course changes
    useEffect(() => {
        if (!selectedCursId) return;
        setLoading(true);
        fetch(`/didactic/course/${selectedCursId}/enrolled`, { headers: { 'Authorization': `Bearer ${token}` } })
            .then(res => res.json())
            .then(enrollments => {
                const uniqueGroups = [...new Set(enrollments.map(e => e.student.facultyGroup))];
                setGrupe(uniqueGroups);
                // pick first by default
                if (uniqueGroups.length) setSelectedGrupa(uniqueGroups[0]);
                setLoading(false);
            })
            .catch(err => { console.error(err); setLoading(false); });
    }, [selectedCursId, token]);

    // Load grades when selectedGrupa or selectedCursId changes
    useEffect(() => {
        if (!selectedCursId || !selectedGrupa) return;
        setLoading(true);
        fetch(`/didactic/course/${selectedCursId}/grades`, { headers: { 'Authorization': `Bearer ${token}` } })
            .then(res => res.json())
            .then(grades => {
                const filtered = grades
                    .filter(g => g.student.facultyGroup === selectedGrupa)
                    .map(g => ({ name: `${g.student.firstName} ${g.student.lastName}`, grade: g.value }));
                setCatalog(filtered);
                setLoading(false);
            })
            .catch(err => { console.error(err); setLoading(false); });
    }, [selectedCursId, selectedGrupa, token]);

    const handleUploadExcel = () => alert('Upload Excel (mock)');
    const handleDownloadExcel = () => alert('Download Excel (mock)');

    const currentCourseTitle = cursuri.find(c => c.id === selectedCursId)?.title || '';

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
                        <tr className="titlu">
                            <th>Nume student</th>
                            <th>Titlu curs</th>
                            <th>Nota finală</th>
                            <th>Administrative Note</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading && <tr><td colSpan="4">Se încarcă...</td></tr>}
                        {!loading && catalog.length === 0 && <tr><td colSpan="4">Nicio înregistrare.</td></tr>}
                        {!loading && catalog.map((item, idx) => (
                            <tr key={idx}>
                                <td>{item.name}</td>
                                <td>{currentCourseTitle}</td>
                                <td>{item.grade}</td>
                                <td>
                                    <button className="admin-button" onClick={() => alert(`Deschide fișa pentru ${item.name}`)}>
                                        <img src="/icons/edit-icon.png" alt="Admin Note" className="icon-img" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="catalog-buttons">
                <div className="catalog-buttons">
                    <button onClick={handleUploadExcel}>Încarcă Excel</button>
                    <button onClick={handleDownloadExcel}>Descarcă Excel</button>
                </div>
            </div>
        </div>
    );
};

export default Profesor;
