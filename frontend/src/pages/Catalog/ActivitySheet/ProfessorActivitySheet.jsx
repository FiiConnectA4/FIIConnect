import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import './ProfessorActivitySheet.css';

const ProfessorActivitySheet = () => {
    const { courseId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    const [course, setCourse] = useState(null);
    const [students, setStudents] = useState([]);
    const [components, setComponents] = useState([]);
    const [grades, setGrades] = useState([]);
    const [selectedGrupa, setSelectedGrupa] = useState('');
    const [grupe, setGrupe] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingCell, setEditingCell] = useState(null);
    const [editedGrade, setEditedGrade] = useState('');

    const token = localStorage.getItem('token');
    const searchParams = new URLSearchParams(location.search);
    const grupaParam = searchParams.get('grupa');

    useEffect(() => {
        if (!courseId) return;

        const fetchData = async () => {
            try {
                const courseRes = await fetch(`/didactic/course/${courseId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const courseData = await courseRes.json();
                setCourse(courseData);

                const enrolledRes = await fetch(`/didactic/course/${courseId}/enrolled`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const enrolledData = await enrolledRes.json();

                const uniqueGroups = [...new Set(enrolledData.map(e => e.student.facultyGroup))];
                setGrupe(uniqueGroups);

                const defaultGroup = grupaParam || uniqueGroups[0] || '';
                setSelectedGrupa(defaultGroup);

                const groupStudents = enrolledData
                    .filter(e => e.student.facultyGroup === defaultGroup)
                    .map(e => e.student);
                setStudents(groupStudents);

                const formulaRes = await fetch(`/didactic/course/${courseId}/formula`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const formulaData = await formulaRes.json();
                const comps = formulaData.components || [];

                setComponents(comps);

                const allScores = [];

                for (const comp of comps) {
                    const res = await fetch(`/didactic/component-score/all/by-component?idComponent=${comp.id}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    if (res.ok) {
                        const scores = await res.json();
                        allScores.push(...scores);
                    }
                }
                setGrades(allScores);

            } catch (err) {
                console.error('Error fetching data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [courseId, token]);

    useEffect(() => {
        if (!courseId || !selectedGrupa) return;

        fetch(`/didactic/course/${courseId}/enrolled`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(enrolledData => {
                const groupStudents = enrolledData
                    .filter(e => e.student.facultyGroup === selectedGrupa)
                    .map(e => e.student);
                setStudents(groupStudents);
            })
            .catch(err => console.error('Error fetching students:', err));
    }, [selectedGrupa, courseId, token]);

    const getGradeForStudent = (studentId, componentId) => {
        const grade = grades.find(g =>
            g.id?.idStud === studentId && g.id?.idComponent === componentId
        );
        return grade?.value || '';
    };

    const handleSaveGrade = async (studentId, componentId, value) => {
        if (!value || isNaN(parseFloat(value)) || parseFloat(value) < 1 || parseFloat(value) > 10) {
            alert('Nota trebuie să fie între 1 și 10.');
            return;
        }

        const existingGrade = grades.find(g =>
            g.id?.idStud === studentId && g.id?.idComponent === componentId
        );

        const method = existingGrade ? 'PUT' : 'POST';
        const payload = {
            id: { idStud: studentId, idComponent: componentId },
            value: parseFloat(value),
            gradingDate: new Date().toISOString()
        };

        try {
            const response = await fetch('/didactic/component-score', {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) throw new Error(`Error ${method}`);

            if (existingGrade) {
                setGrades(grades.map(g =>
                    g.id?.idStud === studentId && g.id?.idComponent === componentId
                        ? { ...g, value: parseFloat(value), gradingDate: payload.gradingDate }
                        : g
                ));
            } else {
                setGrades([...grades, {
                    id: { idStud: studentId, idComponent: componentId },
                    value: parseFloat(value),
                    gradingDate: payload.gradingDate
                }]);
            }

            setEditingCell(null);
            setEditedGrade('');

        } catch (err) {
            console.error('Error saving grade:', err);
            alert('Eroare la salvarea notei: ' + err.message);
        }
    };

    const handleUploadCSV = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.csv';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const formData = new FormData();
            formData.append('file', file);

            fetch(`/didactic/course/${courseId}/upload_component_scores_csv`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            })
                .then(res => {
                    if (!res.ok) throw new Error('Eroare la încărcarea fișierului CSV');
                    return res.json().catch(() => null);
                })
                .then(() => {
                    alert('Fișierul CSV a fost încărcat cu succes!');
                    window.location.reload();
                })
                .catch(err => {
                    console.error(err);
                    alert('Eroare la încărcarea fișierului CSV: ' + err.message);
                });
        };
        input.click();
    };

    if (loading) {
        return (
            <div className="container-activity-sheet">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p className="loading-text">Se încarcă fișa de activitate…</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container-activity-sheet">
            <div className="activity-header">
                <h1>
                    <span className="title-icon">📋</span>
                    Fișă de Activitate - {course?.title}
                </h1>
                <div className="header-controls">
                    <select value={selectedGrupa} onChange={e => setSelectedGrupa(e.target.value)}>
                        {grupe.map((g, i) => <option key={i} value={g}>{g}</option>)}
                    </select>
                    <button onClick={() => navigate('/app/catalog')} className="close-button">
                        <span className="button-icon">←</span>
                        Înapoi la Catalog
                    </button>
                </div>
            </div>

            <div className="activity-content">
                <div className="activity-table">
                    <div className="table-wrapper">
                        <table>
                            <thead>
                            <tr>
                                <th className="student-header">Student</th>
                                {components.map(comp => (
                                    <th key={comp.id} className="component-header">
                                        {comp.name}
                                    </th>
                                ))}
                            </tr>
                            </thead>
                            <tbody>
                            {students.map(student => (
                                <tr key={student.id}>
                                    <td className="student-name">
                                        {student.firstName} {student.lastName}
                                    </td>
                                    {components.map(comp => {
                                        const cellKey = `${student.id}-${comp.id}`;
                                        const currentGrade = getGradeForStudent(student.id, comp.id);
                                        const isEditing = editingCell === cellKey;

                                        return (
                                            <td key={comp.id} className="grade-cell">
                                                {isEditing ? (
                                                    <div className="edit-container">
                                                        <input
                                                            type="number"
                                                            min="1"
                                                            max="10"
                                                            step="0.1"
                                                            value={editedGrade}
                                                            onChange={e => setEditedGrade(e.target.value)}
                                                            className="grade-input"
                                                            onKeyPress={e => {
                                                                if (e.key === 'Enter') {
                                                                    handleSaveGrade(student.id, comp.id, editedGrade);
                                                                }
                                                            }}
                                                            autoFocus
                                                        />
                                                        <div className="edit-buttons">
                                                            <button
                                                                onClick={() => handleSaveGrade(student.id, comp.id, editedGrade)}
                                                                className="save-btn"
                                                            >
                                                                💾
                                                            </button>
                                                            <button
                                                                onClick={() => {
                                                                    setEditingCell(null);
                                                                    setEditedGrade('');
                                                                }}
                                                                className="cancel-btn"
                                                            >
                                                                ❌
                                                            </button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div
                                                        className="grade-display"
                                                        onClick={() => {
                                                            setEditingCell(cellKey);
                                                            setEditedGrade(currentGrade.toString());
                                                        }}
                                                    >
                                                            <span className={`grade-value ${currentGrade ? 'has-grade' : 'no-grade'}`}>
                                                                {currentGrade || '-'}
                                                            </span>
                                                        <span className="edit-icon">✏️</span>
                                                    </div>
                                                )}
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="activity-buttons">
                    <button onClick={handleUploadCSV} className="upload-btn">
                        📁 Încarcă CSV Note Componente
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProfessorActivitySheet;