import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ActivitySheet.css';

const API_BASE_URL = '';

const ActivitySheet = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const [student, setStudent] = useState(null);
    const [components, setComponents] = useState([]);
    const [grades, setGrades] = useState([]);
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem('token');

    useEffect(() => {
        if (!token) return;

        const fetchData = async () => {
            try {
                // Get student info
                const studentRes = await fetch(`${API_BASE_URL}/person/me`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const studentData = await studentRes.json();
                setStudent(studentData.student);

                // Get course info
                const courseRes = await fetch(`${API_BASE_URL}/didactic/course/${courseId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const courseData = await courseRes.json();
                setCourse(courseData);

                // Get formula info
                const formulaRes = await fetch(`${API_BASE_URL}/didactic/course/${courseId}/formula`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const formulaData = await formulaRes.json();
                const comps = formulaData.components || [];

                if (!comps.find(c => c.name.toLowerCase().includes('prezen'))) {
                    comps.push({ name: 'Prezențe' });
                }
                setComponents(comps);

                // Get all component scores by student
                const scoresRes = await fetch(`${API_BASE_URL}/didactic/component-score/all/by-student?idStud=${studentData.student.id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const scoresData = await scoresRes.json();

                // Map with component ID for faster access
                const scoresMap = new Map();
                for (const score of scoresData) {
                    if (score.id && score.id.idComponent != null) {
                        scoresMap.set(score.id.idComponent, score.value);
                    }
                }

                // Match each formula component to its score
                const scoredComponents = comps.map(comp => {
                    const score = scoresData.find(g => g.component?.name === comp.name);
                    return {
                        ...comp,
                        nota: score?.value ?? '-'
                    };
                });

                setGrades(scoredComponents);
            } catch (err) {
                console.error('⛔ Eroare:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [courseId, token]);

    if (loading) return <div className="container-fisa">Se încarcă fișa de activitate…</div>;

    return (
        <div className="container-fisa">
            <h1>Fișă activitate — {student?.firstName} {student?.lastName}</h1>
            <div className="fisa-info">
                <p><strong>Grupa:</strong> {student?.facultyGroup}</p>
                <p><strong>An:</strong> {student?.year}</p>
                <p><strong>Materie:</strong> {course?.title}</p>
                <p><strong>Semestru:</strong> {course?.semester}</p>
            </div>

            <button onClick={() => navigate('/app/catalog')} className="buton-catalog">Înapoi la Catalog</button>

            <div className="activity-table">
                <table>
                    <thead>
                    <tr>
                        <th>Componentă</th>
                        <th>Notă</th>
                    </tr>
                    </thead>
                    <tbody>
                    {grades.map((comp, idx) => (
                        <tr key={idx}>
                            <td>{comp.name}</td>
                            <td>{comp.nota}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ActivitySheet;