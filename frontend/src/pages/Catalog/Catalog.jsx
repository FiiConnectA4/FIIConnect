import { useSearchParams } from 'react-router-dom';

import Student from "./Student/Student";
import Profesor from "./Profesor/Profesor";
import Administrator from "./Administrator/Administrator";
import { useEffect } from 'react';

const Catalog = () => {
    const [searchParams] = useSearchParams();
    const paramValue = searchParams.get("userType");
    const userType = paramValue !== null && !isNaN(parseInt(paramValue)) ? parseInt(paramValue) : 3;
    useEffect(() => {
        const studentId = 1; // sau ia-l din searchParams sau context
        const token = localStorage.getItem("token");

        fetch(`/didactic/student/${studentId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(res => res.json())
            .then(data => {
                console.log("Date primite de la fetch:", data);
            })
            .catch(err => {
                console.error("Eroare la fetch:", err);
            });
    }, []);
    return (
        <div>
            {userType === 1 && <Student />}
            {userType === 2 && <Profesor />}
            {userType === 3 && <Administrator />}
            {!userType && <p>Tip de utilizator necunoscut.</p>}
        </div>
    );
};

export default Catalog;