import { useState, useEffect } from 'react';
import Ceas from './../Components/Ceas';
import Carte from '../Components/Carte';
import Buton from '../Components/Buton';
import PageControl from '../Components/PageControl'; // doar dacă vrei și acțiuni extra
import './../Student/Student.css';
import PDetaliiCurs from '../DetaliiCurs/DetaliiCurs';
import { useSearchParams } from 'react-router-dom';

const Student = () => {
    const [searchParams] = useSearchParams();
    const studentId = searchParams.get('studentId') || 37;

    const [student, setStudent] = useState(null);
    const [courses, setCourses] = useState([]);
    const [selectedCourseId, setSelectedCourseId] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`/didactic/student/${studentId}`)
            .then((res) => {
                if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
                return res.json();
            })
            .then((data) => {
                console.log("👨‍🎓 Student info:", data);
                setStudent(data);
                const inscrieri = data.enrollments || [];
                const cursuri = inscrieri
                    .map((e) => e.course)
                    .filter((c) => c.archived !== 1);
                setCourses(cursuri);
                setLoading(false);
            })
            .catch((err) => {
                console.error("⛔ Eroare la încărcarea studentului:", err);
                setCourses([]);
                setLoading(false);
            });
    }, [studentId]);

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
                            />
                            <Ceas />
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