import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./OrarToti.css"; // Import CSS pentru styling

const Orar = () => {
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
            navigate(`/app/orar-secretariat/${section}`);
        } else {
            navigate(`/app/orar/${section}`);
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
        <div className="orar-container">
            <div className="orar-titlu">
                <h1>Orar {userRole === "ROLE_ADMIN" ? "Secretariat" : ""}</h1>
                <h2>Alege o categorie</h2>
            </div>

            <div className="orar-buttons">
                <button
                    className="orar-button"
                    onClick={() => handleSectionChange("studenti")}
                >
                    🎓 Orar Studenți
                </button>
                <button
                    className="orar-button"
                    onClick={() => handleSectionChange("profesori")}
                >
                    👨‍🏫 Orar Profesori
                </button>
                <button
                    className="orar-button"
                    onClick={() => handleSectionChange("sali")}
                >
                    🏫 Orar Săli
                </button>
                <button
                    className="orar-button"
                    onClick={() => handleSectionChange("discipline")}
                >
                    📚 Orar Discipline
                </button>
            </div>
        </div>
    );
};

export default Orar;