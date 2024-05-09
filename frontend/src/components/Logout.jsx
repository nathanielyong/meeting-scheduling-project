import axios from 'axios';
import { Navigate } from "react-router-dom";

function Logout() {
    localStorage.clear();
    return <Navigate to="/accounts/login" />
}

export default Logout