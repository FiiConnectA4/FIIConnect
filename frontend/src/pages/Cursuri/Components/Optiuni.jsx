import React from "react";
import "./Component.css";

function Optiuni() {
    const handleDelete = () => {
        // Aici pui logica pentru butonul de ștergere
        console.log("Șterge ceva...");
    };

    const handleDownload = () => {
        // Aici pui logica pentru butonul de download
        console.log("Descarcă ceva...");
    };

    return (
        <div className="icon-buttons-container">
            <button className="icon-button" onClick={handleDelete}>
                <img
                    src="/Delete.png"
                    alt="Delete icon"
                    className="icon-image"
                />
            </button>
            <button className="icon-button" onClick={handleDownload}>
                <img
                    src="/Archive.png"
                    alt="Download icon"
                    className="icon-image"
                />
            </button>
        </div>
    );
}

export default Optiuni;