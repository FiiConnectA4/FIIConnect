import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ActivitySheet.css';

const ActivitySheet = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const [student, setStudent] = useState(null);
    const [components, setComponents] = useState([]);
    const [grades, setGrades] = useState([]);
    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem('token');
    const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
    };

    useEffect(() => {
        if (!token) return;

        fetch('/person/me', { headers })
            .then(res => res.json())
            .then(data => {
                setStudent(data.student);
                return fetch(`/didactic/course/${courseId}/grades`, { headers });
            })
            .then(res => res.json())
            .then(gradesData => {
                setGrades(gradesData);
                return fetch(`/didactic/course/${courseId}/formula-components`, { headers });
            })
            .then(res => res.json())
            .then(compData => {
                let comps = compData;
                if (!comps.find(c => c.name.toLowerCase().includes('prezen'))) {
                    comps.push({ name: 'Prezențe' });
                }
                setComponents(comps);
            })
            .catch(err => console.error('⛔ Eroare:', err))
            .finally(() => setLoading(false));
    }, [courseId]);

    if (loading) return <div className="container-fisa">Se încarcă fișa de activitate…</div>;

    return (
        <div className="container-fisa">
            <h1>Fișă activitate — {student?.firstName} {student?.lastName}</h1>
            <button onClick={() => navigate(-1)} className="buton-catalog" style={{ marginBottom: '1rem' }}>Înapoi la Catalog</button>

            <div className="activity-table">
                <table>
                    <thead>
                    <tr>
                        <th>Componentă</th>
                        <th>Notă</th>
                    </tr>
                    </thead>
                    <tbody>
                    {components.map((comp, idx) => {
                        const nota = grades.find(g => g.component?.name === comp.name)?.value ?? '-';
                        return (
                            <tr key={idx}>
                                <td>{comp.name}</td>
                                <td>{nota}</td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ActivitySheet;