import { useState, useEffect } from 'react';
import Ceas from './../Components/Ceas';
import Carte from '../Components/Carte';
import Buton from '../Components/Buton';
import PageControl from '../Components/PageControl'; // opțional
import { useNavigate } from 'react-router-dom';
import './../Student/Student.css';
import PDetaliiCurs from '../DetaliiCurs/DetaliiCurs';

const Student = () => {
    const [student, setStudent] = useState(null);
    const [courses, setCourses] = useState([]);
    const [selectedCourseId, setSelectedCourseId] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (!token) {
            console.error("⛔ Token not found in localStorage");
            setLoading(false);
            return;
        }

        // Pasul 1: ia studentId din JWT
        fetch('/person/me', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(res => {
                if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
                return res.json();
            })
            .then(user => {
                console.log("🔍 User info:", user);
                const studentId = user?.student?.id;

                if (!studentId) {
                    console.error("⛔ studentId not found in user object");
                    setLoading(false);
                    return;
                }

                // Pasul 2: încarcă studentul
                return fetch(`/didactic/student/${studentId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
            })
            .then(res => {
                if (!res) return;
                if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
                return res.json();
            })
            .then(data => {
                if (!data) return;
                console.log("👨‍🎓 Student info:", data);
                setStudent(data);

                const inscrieri = data.enrollments || [];
                const cursuri = inscrieri
                    .map((e) => e.course)
                    .filter((c) => c.archived !== 1);
                setCourses(cursuri);
            })
            .catch(err => {
                console.error("⛔ Eroare la încărcarea datelor:", err);
                setCourses([]);
            })
            .finally(() => {
                setLoading(false);
            });

    }, []);

    if (loading) return <div>Loading...</div>;

    if (selectedCourseId) {
        const course = courses.find(c => c.id === selectedCourseId);
        if (!course) {
            console.error(`Cursul cu ID ${selectedCourseId} nu a fost găsit`);
            setSelectedCourseId(null);
            return <div>Cursul nu a fost găsit</div>;
        }
        return (
            <PDetaliiCurs
                curs={course}
                onBack={() => setSelectedCourseId(null)}
            />
        );
    }

    return (
        <div className="container-cursuri">
            <div className="cursuri-titlu">
                <h1>Cursurile mele</h1>
                <Ceas />
            </div>

            {student && (
                <div className="student-info">
                    <p>Student: {student.firstName} {student.lastName} — grupa {student.facultyGroup}, anul {student.year}</p>
                </div>
            )}

            <div className="lista-cursuri">
                {courses.length > 0 ? (
                    courses.map((curs) => (
                        <div key={curs.id} className="rand-curs">
                            <Carte
                                userType='student'
                                id={curs.id}
                            />
                            <Ceas onClick={() => navigate(`/app/orar/discipline/${encodeURIComponent(curs.title)}`)} />
                            <Buton
                                text={curs.title || 'Titlu indisponibil'}
                                onNavigate={() => setSelectedCourseId(curs.id)}
                            />
                        </div>
                    ))
                ) : (
                    <p>Nu există cursuri la care ești înscris.</p>
                )}
            </div>
        </div>
    );
};

export default Student;
