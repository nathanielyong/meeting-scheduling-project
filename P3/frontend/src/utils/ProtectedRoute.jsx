import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import api from "./api";
import { useState, useEffect } from "react";

function ProtectedRoute({ children }) {
    const [authenticated, setAuthenticated] = useState(null);

    useEffect(() => {
        auth().catch(() => setAuthenticated(false))
    }, [])

    const refresh = async () => {
        const refreshToken = localStorage.getItem('refreshToken');
        try {
            const response = await api.post("/accounts/login/refresh/", {
                refresh: refreshToken,
            });
            if (response.status === 200) {
                localStorage.setItem('accessToken', response.data.access);
                setAuthenticated(true);
            } else {
                setAuthenticated(false);
            }
        } catch (error) {
            console.log(error);
            setAuthenticated(false);
        }
    };

    const auth = async () => {
        const access = localStorage.getItem("accessToken");
        if (!access) {
            setAuthenticated(false);
            return;
        }

        if (jwtDecode(access).exp < (Date.now() / 1000)) {
            await refresh();
        } else {
            setAuthenticated(true);
        }

    };

    if (authenticated === null) {
        return <div>
            <p>Please wait while we authenticate...</p>
        </div>;
    }

    return authenticated ? children : <Navigate to="/accounts/login" />;
}

export default ProtectedRoute;