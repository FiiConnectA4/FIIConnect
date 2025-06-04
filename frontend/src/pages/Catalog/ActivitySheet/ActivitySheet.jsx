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

    if (loading) {
        return (
            <div className="container-fisa">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p className="loading-text">Se încarcă fișa de activitate…</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container-fisa">
            <div className="header-section">
                <h1 className="page-title">
                    <span className="title-icon">📋</span>
                    Fișă activitate — {student?.firstName} {student?.lastName}
                </h1>

                <button
                    onClick={() => navigate('/app/catalog')}
                    className="buton-catalog"
                >
                    <span className="button-icon">←</span>
                    Înapoi la Catalog
                </button>
            </div>

            <div className="content-wrapper">
                <div className="fisa-info">
                    <div className="info-grid">
                        <div className="info-item">
                            <span className="info-label">Grupa:</span>
                            <span className="info-value">{student?.facultyGroup}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">An:</span>
                            <span className="info-value">{student?.year}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Materie:</span>
                            <span className="info-value">{course?.title}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Semestru:</span>
                            <span className="info-value">{course?.semester}</span>
                        </div>
                    </div>
                </div>

                <div className="activity-table">
                    <div className="table-header">
                        <h2>Evaluări și Note</h2>
                    </div>
                    <div className="table-wrapper">
                        <table>
                            <thead>
                            <tr>
                                <th>Componentă</th>
                                <th>Notă</th>
                            </tr>
                            </thead>
                            <tbody>
                            {grades.map((comp, idx) => (
                                <tr key={idx} className={idx % 2 === 0 ? 'row-even' : 'row-odd'}>
                                    <td className="component-name">{comp.name}</td>
                                    <td className="grade-value">
                                            <span className={`grade-badge ${comp.nota !== '-' ? 'has-grade' : 'no-grade'}`}>
                                                {comp.nota}
                                            </span>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ActivitySheet;