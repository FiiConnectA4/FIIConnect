import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Secretariat.css";

const Secretariat = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userRole, setUserRole] = useState(null);

    useEffect(() => {
        const fetchUserRole = async () => {
            try {
                const token = localStorage.getItem("token");

                if (!token) {
                    navigate("/", { replace: true });
                    return;
                }

                const response = await fetch("http://localhost:34101/person/me", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    if (response.status === 401) {
                        localStorage.removeItem("token");
                        localStorage.removeItem("role");
                        navigate("/", { replace: true });
                        return;
                    }
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const userData = await response.json();
                console.log("User data:", userData);

                localStorage.setItem("role", userData.role);
                setUserRole(userData.role);
            } catch (error) {
                console.error("Error fetching user role:", error);
                setError("Failed to fetch user information");
                navigate("/", { replace: true });
            } finally {
                setLoading(false);
            }
        };

        fetchUserRole();
    }, [navigate]);

    const handleSectionChange = (section) => {
        // Navigate based on user role
        if (userRole === "ROLE_ADMIN") {
            navigate(`/app/secretariat/${section}`);
        } else {
            // Students and professors go to student interface
            navigate(`/app/student/${section}`);
        }
    };

    const handleIstoricCereri = () => {
        // Only students can see historic requests
        if (userRole !== "ROLE_ADMIN") {
            navigate("/app/student/istoric-cereri");
        }
    };

    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                fontSize: '18px'
            }}>
                Se încarcă...
            </div>
        );
    }

    if (error) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                fontSize: '18px',
                color: 'red'
            }}>
                {error}
            </div>
        );
    }

    return (
        <div className="secretariat-container">
            <div className="secretariat-header">
                <div className="secretariat-titlu">
                    <h1>
                        {userRole === "ROLE_ADMIN" ? "Secretariat" : "Cereri Student"}
                    </h1>
                    <h2>Alege o opțiune</h2>
                </div>
            </div>

            <div className="secretariat-buttons">
              
                <button
                    className="secretariat-button"
                    onClick={() => handleSectionChange("cerere-adeverinte")}
                >
                    📝 {userRole === "ROLE_ADMIN" ? "Gestionează" : "Cerere"} Adeverințe
                </button>

                <button
                    className="secretariat-button"
                    onClick={() => handleSectionChange("cerere-bursa-sociala")}
                >
                    💰 {userRole === "ROLE_ADMIN" ? "Gestionează" : "Cerere"} Bursă Socială
                </button>

                <button
                    className="secretariat-button"
                    onClick={() => handleSectionChange("cerere-caz-social")}
                >
                    📂 {userRole === "ROLE_ADMIN" ? "Gestionează" : "Cerere"} Caz Social
                </button>

                {/* Atribuire Tag-uri button for secretariat/admin only */}
                {(userRole === "ROLE_ADMIN" || userRole === "ROLE_SECRETARIAT") && (
                    <button
                        className="secretariat-button"
                        onClick={() => navigate("/app/secretariat/atribuire-taguri")}
                    >
                        🏷️ Atribuire Tag-uri
                    </button>
                )}

                {userRole !== "ROLE_ADMIN" && (
                    <button
                        className="secretariat-button"
                        onClick={handleIstoricCereri}
                    >
                        📄 Istoric Cereri
                    </button>
                )}
            </div>
        </div>
    );
};

export default Secretariat;