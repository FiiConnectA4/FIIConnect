import { useState, useEffect } from 'react';
import Ceas from './../Components/Ceas';
import Carte from '../Components/Carte';
import Buton from '../Components/Buton';
import PageControl from '../Components/PageControl';
import './../Student/Student.css';
import PDetaliiCurs from './PDetaliiCurs';

const Profesor = ({ professorId = 1 }) => {
    const [courses, setCourses] = useState([]);
    const [selectedCourseId, setSelectedCourseId] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`/didactic/professor/${professorId}/courses`)
            .then((res) => res.json())
            .then((data) => {
                setCourses(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error('Error loading courses', err);
                setLoading(false);
            });
    }, [professorId]);

    if (loading) return <div>Loading...</div>;

    if (selectedCourseId) {
        const course = courses.find(c => c.id === selectedCourseId);
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
            <div className="lista-cursuri">
                {courses.map((curs) => (
                    <div key={curs.id} className="rand-curs">
                        <Carte />
                        <Buton text={curs.title} onNavigate={() => setSelectedCourseId(curs.id)} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Profesor;