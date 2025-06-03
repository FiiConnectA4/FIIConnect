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

                // Get formula components
                const formulaRes = await fetch(`${API_BASE_URL}/didactic/course/${courseId}/formula-components`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const formulaData = await formulaRes.json();
                let comps = formulaData;
                if (!comps.find(c => c.name.toLowerCase().includes('prezen'))) {
                    comps.push({ name: 'Prezențe' });
                }
                setComponents(comps);

                // Get grades
                const gradesRes = await fetch(`${API_BASE_URL}/didactic/course/${courseId}/grades`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const gradesData = await gradesRes.json();
                setGrades(gradesData);

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