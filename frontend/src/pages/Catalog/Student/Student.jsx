import { useEffect, useState } from 'react';
import './Student.css';

const API_BASE_URL = '';

async function getStudentId(token) {
    try {
        const response = await fetch(`${API_BASE_URL}/person/me`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.role !== 'ROLE_STUDENT' || !data.student?.id) {
            throw new Error('Utilizatorul nu este student sau lipsește ID-ul');
        }

        return data.student.id;
    } catch (error) {
        console.error('Error fetching student ID:', error);
        return null;
    }
}

const StudentCatalog = () => {
    const [semestre, setSemestre]       = useState([]);
    const [selectedSem, setSelectedSem] = useState('');
    const [bySem, setBySem]             = useState({});
    const [curCatalog, setCurCatalog]   = useState([]);
    const [points, setPoints]           = useState(0);
    const [avg, setAvg]                 = useState(0);
    const [loading, setLoading]         = useState(true);
    const [studentId, setStudentId]     = useState(null);

    const token   = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    // 🔹 Obține ID-ul studentului din /person/me
    useEffect(() => {
        if (!token) return;

        getStudentId(token).then(id => {
            if (id) {
                setStudentId(id);
            } else {
                setLoading(false);
            }
        });
    }, [token]);

    // 🔹 După ce avem ID-ul, încărcăm cursurile și notele
    useEffect(() => {
        if (!studentId) return;

        (async () => {
            try {
                const res     = await fetch('/didactic/course', { headers });
                const body    = await res.json();
                const courses = body._embedded?.courseList ?? [];

                if (!courses.length) {
                    setLoading(false);
                    return;
                }

                const detailPromises = courses.map(async c => {
                    const [gradesRes, detailRes] = await Promise.all([
                        fetch(`/didactic/course/${c.id}/grades`, { headers }),
                        fetch(`/didactic/course/${c.id}`,        { headers })
                    ]);

                    const grades = await gradesRes.json();
                    const det    = await detailRes.json();

                    var myGrade = grades.find(g => Number(g.student?.id) === studentId);
                    if (!myGrade)
                        myGrade = { value: '' };

                    const teaching   = det.professors?.[0];
                    const profObj    = teaching?.professor;
                    const profName   = profObj
                        ? `${profObj.firstName} ${profObj.lastName}`
                        : '—';

                    return {
                        semestru : `Semestrul ${det.semester}`,
                        curs     : det.title,
                        profesor : profName,
                        credite  : det.credits,
                        nota     : myGrade.value
                    };
                });

                const raw = (await Promise.all(detailPromises)).filter(Boolean);

                const grouped = raw.reduce((acc, row) => {
                    (acc[row.semestru] = acc[row.semestru] || []).push(row);
                    return acc;
                }, {});
                const semKeys = Object.keys(grouped);

                setSemestre(semKeys);
                setSelectedSem(semKeys[0] || '');
                setBySem(grouped);
                setLoading(false);
            } catch (err) {
                console.error('⛔  Eroare catalog student:', err);
                setLoading(false);
            }
        })();
    }, [studentId]);

    // 🔹 Recalculare punctaj și medie
    useEffect(() => {
        const cursuri = bySem[selectedSem] || [];
        setCurCatalog(cursuri);

        const p  = cursuri.reduce((s, c) => s + c.credite * c.nota, 0);
        const cr = cursuri.reduce((s, c) => s + c.credite, 0);
        setPoints(p);
        setAvg(cr ? (p / cr).toFixed(2) : 0);
    }, [selectedSem, bySem]);

    if (loading) return <div className="container-catalog">Se încarcă catalogul…</div>;

    return (
        <div className="container-catalog">
            <div className="catalog-header">
                <h1>CATALOG</h1>
                <div className="select-controls">
                    <select
                        value={selectedSem}
                        onChange={e => setSelectedSem(e.target.value)}
                    >
                        {semestre.map(s => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="catalog-table">
                <table>
                    <thead>
                    <tr className="titlu">
                        <th>Curs</th><th>Profesor</th><th>Credite</th><th>Notă</th><th>Fișa</th>
                    </tr>
                    </thead>
                    <tbody>
                    {curCatalog.length === 0 && (
                        <tr><td colSpan="5">Nu există note pentru semestrul selectat.</td></tr>
                    )}
                    {curCatalog.map((c, i) => (
                        <tr key={i}>
                            <td>{c.curs}</td>
                            <td>{c.profesor}</td>
                            <td>{c.credite}</td>
                            <td>{c.nota}</td>
                            <td>
                                <button onClick={() => alert(`Fișa activitate: ${c.curs}`)}>
                                    <img src="/icons/edit-icon.png" alt="Fișa" className="icon-img" />
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            <div className="catalog-footer">
                <button className="buton-catalog" onClick={() => alert('Download Excel (mock)')}>
                    Descarcă Excel
                </button>
                <div className="stats">
                    <p><strong>Punctaj final:</strong> {points}</p>
                    <p><strong>Media finală:</strong> {avg}</p>
                </div>
            </div>
        </div>
    );
};

export default StudentCatalog;
