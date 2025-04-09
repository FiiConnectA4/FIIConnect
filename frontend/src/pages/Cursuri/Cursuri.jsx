import { useState } from 'react';
import Student from "./Student/Student";
import Profesor from "./Profesor/Profesor";
import Administrator from "./Administrator/Administrator";

const Cursuri = () => {
    let userType = 1;
    // aici in functie de cont -student 2-profesor 3-administrator
    // unit cu back-ul

    return (
        <div>
            {userType === 1 && <Student />}
            {userType === 2 && <Profesor />}
            {userType === 3 && <Administrator />}
        </div>
    );
};

export default Cursuri;