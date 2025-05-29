
import Student from "./Student/Student";
import Profesor from "./Profesor/Profesor";
import Administrator from "./Administrator/Administrator";
import {useEffect, useState} from "react";
const API_BASE_URL = '';

async function getUserType(token) {
    try {
        const response = await fetch(`${API_BASE_URL}/person/me`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data.role; // e.g., "ROLE_ADMIN"
    } catch (error) {
        console.error('Error fetching user type:', error);
        return null;
    }
}
const Catalog = () => {
    const [userType, setUserType] = useState(null);
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (token) {
            getUserType(token).then(setUserType);
        }
    }, [token]);
    return (
        <div>
            {userType === "ROLE_STUDENT" && <Student />}
            {userType === "ROLE_ADMIN" && <Administrator />}
            {userType === "ROLE_PROFESOR" && <Profesor />}
            {!userType && <p>Utilizator necunoscut</p>}
        </div>
    );
};

export default Catalog;