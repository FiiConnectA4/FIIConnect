import { useEffect, useState } from 'react';
import './Administrator.css';

const Administrator = () => {
    const [grupe, setGrupe] = useState([]);
    const [selectedGrupa, setSelectedGrupa] = useState('');

    const [cursuri, setCursuri] = useState([]);
    const [selectedCursId, setSelectedCursId] = useState(null);

    const [catalog, setCatalog] = useState([]);
    const [loading, setLoading] = useState(false);

    const token = localStorage.getItem('token');

    // Load courses
    useEffect(() => {
        fetch('/didactic/course', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => {
                const courseList = (data._embedded?.courseList || []).filter(c => c.archived !== 1);
                console.log('Cursuri disponibile:', courseList);
                setCursuri(courseList);
                if (courseList.length) setSelectedCursId(courseList[0].id);
            })
            .catch(err => console.error('Eroare la încărcarea cursurilor:', err));
    }, [token]);

    // Load groups when course changes
    useEffect(() => {
        if (!selectedCursId) return;
        setLoading(true);
        fetch(`/didactic/course/${selectedCursId}/enrolled`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(enrollments => {
                console.log('Enrollments:', enrollments);
                const allGroups = [...new Set(enrollments.map(e => e.student.facultyGroup))];
                console.log('Grupe extrase:', allGroups);
                setGrupe(allGroups);
                setSelectedGrupa(allGroups[0] || '');
                setLoading(false);
            })
            .catch(err => {
                console.error('Eroare la încărcarea grupelor:', err);
                setLoading(false);
            });
    }, [selectedCursId, token]);

    // Load grades when group or course changes
    useEffect(() => {
        if (!selectedCursId || !selectedGrupa) return;
        setLoading(true);
        fetch(`/didactic/course/${selectedCursId}/grades`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => {
                console.log('Toate notele:', data);
                const filtered = data
                    .filter(entry => {
                        console.log(`Grupa student: ${entry.student.facultyGroup}, Grupa selectată: ${selectedGrupa}`);
                        return entry.student.facultyGroup === selectedGrupa;
                    })
                    .map(entry => ({
                        name: `${entry.student.firstName} ${entry.student.lastName}`,
                        grade: entry.value
                    }));
                console.log('Note filtrate pentru grupa selectată:', filtered);
                setCatalog(filtered);
                setLoading(false);
            })
            .catch(err => {
                console.error('Eroare la fetch:', err);
                setLoading(false);
            });
    }, [selectedCursId, selectedGrupa, token]);

    const handleUploadExcel = () => alert('Upload Excel (mock)');
    const handleDownloadExcel = () => alert('Download Excel (mock)');

    return (
        <div className="container-catalog">
            <div className="catalog-header">
                <h1>CATALOG</h1>
                <div className="select-controls">
                    {/* Prima select: grupe */}
                    <select
                        value={selectedGrupa}
                        onChange={e => setSelectedGrupa(e.target.value)}
                    >
                        {grupe.map((g, i) => (
                            <option key={i} value={g}>{g}</option>
                        ))}
                    </select>

                    {/* A doua select: cursuri */}
                    <select
                        value={selectedCursId || ''}
                        onChange={e => setSelectedCursId(parseInt(e.target.value, 10))}
                    >
                        {cursuri.map(c => (
                            <option key={c.id} value={c.id}>{c.title}</option>
                        ))}
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
                                    <td>{item.grade}</td>
                                    <td>
                                        <button className="admin-button" onClick={() => alert(`Deschide fișa pentru ${item.name}`)}>
                                            <img src="/icons/edit-icon.png" alt="Admin Note" className="icon-img" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            <div className="catalog-buttons">
                <button onClick={handleUploadExcel}>Upload Excel</button>
                <button onClick={handleDownloadExcel}>Download Excel</button>
            </div>
        </div>
    );
};

export default Administrator;
