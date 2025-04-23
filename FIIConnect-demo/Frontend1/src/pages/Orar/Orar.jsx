import React, { useState } from "react";
import OrarToti from "./OrarToti";
import OrarSecretariat from "./OrarSecretariat"; // Importăm componenta pentru secretariat

const Orar = () => {
    const [userType, setUserType] = useState(2); // Inițializare cu 2 (Secretariat)

    const toggleUserType = () => {
        setUserType((prevType) => (prevType === 1 ? 2 : 1)); // Comută între 1 și 2
    };

    return (
        <div>
            <button onClick={toggleUserType}>
                Schimbă utilizator ({userType === 1 ? "Toti" : "Secretariat"})
            </button>
            {userType === 1 && <OrarToti />}
            {userType === 2 && <OrarSecretariat />}
        </div>
    );
};

export default Orar;