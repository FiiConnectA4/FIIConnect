import React from "react";
import OrarToti from "./OrarToti";
//import OrarSecretariat from "./OrarSecretariat";

const Orar = () => {
    let userType = 1; // 1 pentru Toti, 2 pentru Secretariat (de unit cu backend-ul)

    return (
        <div>
            {userType === 1 && <OrarToti />}
            
        </div>
    );
};

export default Orar;