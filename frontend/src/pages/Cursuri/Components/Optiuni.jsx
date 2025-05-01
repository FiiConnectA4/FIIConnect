import React from "react";
import "./Component.css";

function Optiuni({ onDelete }) {
    const handleDownload = () => {
        console.log("Descarcă ceva...");
    };

    return (
        <div className="icon-buttons-container">
            <button
                className="icon-button"
                onClick={() => {
                    console.log("➡️ Ai apăsat pe ȘTERGERE");
                    if (onDelete) onDelete();
                }}
            >
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