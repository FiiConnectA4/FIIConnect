import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import demisolImg from "./Images/demisol.png";
import parterImg from "./Images/parter.png";
import etaj1Img from "./Images/etaj1.png";
import etaj2Img from "./Images/etaj2.png";
import etaj7Img from "./Images/etaj7.png";
import hartaCompletaImg from "./Images/complet.png"; // Import complete map

const images = {
    Demisol: demisolImg,
    Parter: parterImg,
    "Etajul 1": etaj1Img,
    "Etajul 2": etaj2Img,
    "Etajul 7": etaj7Img,
    "Harta completă": hartaCompletaImg // Add complete map
};

const HartaFullScreen = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { etaj } = location.state || {};

    if (!etaj) {
        navigate("/app/harta");
        return null;
    }

    return (
        <div style={{
            width: "100vw",
            height: "100vh",
            background: "#000",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
        }}>
            <div style={{
                background: "#fff",
                borderRadius: "10px",
                boxShadow: "0 4px 24px rgba(0,0,0,0.5)",
                padding: "24px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center"
            }}>
                <img
                    src={images[etaj]}
                    alt={etaj}
                    style={{
                        maxWidth: "80vw",
                        maxHeight: "70vh",
                        objectFit: "contain",
                        borderRadius: "10px",
                        marginBottom: "24px"
                    }}
                />
                <button
                    style={{
                        padding: "10px 24px",
                        fontSize: "16px",
                        borderRadius: "5px",
                        border: "none",
                        background: "#1976d2",
                        color: "#fff",
                        cursor: "pointer"
                    }}
                    onClick={() => navigate("/app/harta")}
                >
                    Back
                </button>
            </div>
        </div>
    );
};

export default HartaFullScreen;