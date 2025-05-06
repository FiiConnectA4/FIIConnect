import React from "react";
import SecretariatToti from "./SecretariatToti";
//import SecretariatAdm from "./SecretariatAdm";

const Secretariat = () => {
    let userType = 1; // 1 pentru Toti, 2 pentru Secretariat (de unit cu backend-ul)

    return (
        <div>
            {userType === 1 && <SecretariatToti />}
            
        </div>
    );
};

export default Secretariat;