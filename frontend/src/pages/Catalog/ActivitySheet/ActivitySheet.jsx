// ... importurile tale
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ActivitySheet.css';

const API_BASE_URL = '';

const ActivitySheet = () => {
    const { courseId, studentId: routeStudentId } = useParams();
    const navigate = useNavigate();

    const [userRole, setUserRole] = useState(null);
    const [studentId, setStudentId] = useState(null);
    const [student, setStudent] = useState(null);
    const [components, setComponents] = useState([]);
    const [grades, setGrades] = useState([]);
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem('token');
    const isEditable = userRole === 'ROLE_PROFESOR' || userRole === 'ROLE_ADMIN';

    useEffect(() => {
        if (!token) return;

        const fetchData = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/person/me`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const data = await res.json();
                setUserRole(data.role);

                if (data.role === 'ROLE_STUDENT') {
                    setStudentId(data.student?.id);
                    setStudent(data.student);
                } else if (routeStudentId) {
                    setStudentId(routeStudentId);
                    const stuRes = await fetch(`${API_BASE_URL}/didactic/student/${routeStudentId}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    const stuData = await stuRes.json();
                    setStudent(stuData);
                } else {
                    throw new Error("Profesor/Admin fără studentId în URL");
                }

                const courseRes = await fetch(`${API_BASE_URL}/didactic/course/${courseId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const courseData = await courseRes.json();
                setCourse(courseData);

                const formulaRes = await fetch(`${API_BASE_URL}/didactic/course/${courseId}/formula`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const formulaData = await formulaRes.json();
                const comps = formulaData.components || [];
                setComponents(comps);

                const studentToFetch = routeStudentId || data.student.id;
                const scoredComponents = [];

                for (const comp of comps) {
                    if (!comp.id) {
                        scoredComponents.push({ ...comp, nota: '-' });
                        continue;
                    }

                    try {
                        const scoreRes = await fetch(`${API_BASE_URL}/didactic/component-score?idStud=${studentToFetch}&idComponent=${comp.id}`, {
                            headers: { Authorization: `Bearer ${token}` }
                        });

                        if (scoreRes.ok) {
                            const scoreData = await scoreRes.json();
                            scoredComponents.push({
                                ...comp,
                                nota: scoreData?.value ?? '-',
                                scoreId: scoreData?.id ?? null,
                            });
                        } else {
                            scoredComponents.push({ ...comp, nota: '-', scoreId: null });
                        }
                    } catch (e) {
                        console.warn(`Eroare la componenta ${comp.name}:`, e);
                        scoredComponents.push({ ...comp, nota: '-', scoreId: null });
                    }
                }

                setGrades(scoredComponents);
            } catch (err) {
                console.error('⛔ Eroare:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [courseId, token, routeStudentId]);

    const handleGradeChange = (index, value) => {
        setGrades(prev =>
            prev.map((comp, idx) => idx === index ? { ...comp, nota: value } : comp)
        );
    };

    const updateFinalGrade = async () => {
        try {
            const formulaRes = await fetch(`${API_BASE_URL}/didactic/course/${courseId}/formula`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!formulaRes.ok) throw new Error("Formulă inexistentă pentru acest curs");
            const formula = await formulaRes.json();

            const gradeRes = await fetch(`${API_BASE_URL}/didactic/formula/${formula.id}/evaluate?idStud=${studentId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!gradeRes.ok) throw new Error("Eroare la evaluarea formulei");

            const finalGrade = await gradeRes.json();

            const postGradeRes = await fetch(`${API_BASE_URL}/didactic/grade`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(finalGrade)
            });

            if (!postGradeRes.ok) throw new Error("Eroare la salvarea notei finale");
            console.log(`✅ Nota finală actualizată: ${finalGrade.value}`);
        } catch (err) {
            console.error("⛔ Eroare la nota finală:", err);
            alert("Eroare la actualizarea notei finale: " + err.message);
        }
    };

    const handleSave = async () => {
        for (const comp of grades) {
            if (!comp.id || comp.nota === '-') continue;
            const payload = {
                id: {
                    idStud: studentId,
                    idComponent: comp.id
                },
                value: parseFloat(comp.nota)
            };

            const method = comp.scoreId ? 'PUT' : 'POST';

            await fetch(`${API_BASE_URL}/didactic/component-score`, {
                method,
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });
        }

        // ✅ Apelă funcția de actualizare a notei finale
        await updateFinalGrade();

        alert("Notele au fost salvate și nota finală recalculată!");
    };

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
                        {isEditable && (
                            <button className="save-button" onClick={handleSave}>
                                💾 Salvează toate
                            </button>
                        )}
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
                                        {isEditable ? (
                                            <input
                                                type="number"
                                                step="0.01"
                                                min="1"
                                                max="10"
                                                value={comp.nota === '-' ? '' : comp.nota}
                                                onChange={(e) => handleGradeChange(idx, e.target.value)}
                                            />
                                        ) : (
                                            <span className={`grade-badge ${comp.nota !== '-' ? 'has-grade' : 'no-grade'}`}>
                                                    {comp.nota}
                                                </span>
                                        )}
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