import { useSearchParams } from 'react-router-dom';

import Student from "./Student/Student";
import Profesor from "./Profesor/Profesor";
import Administrator from "./Administrator/Administrator";

const Catalog = () => {
    const [searchParams] = useSearchParams();
    const paramValue = searchParams.get("userType");
    const userType = paramValue !== null && !isNaN(parseInt(paramValue)) ? parseInt(paramValue) : 3;

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