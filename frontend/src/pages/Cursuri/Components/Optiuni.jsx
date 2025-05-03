import React from "react";
import "./Component.css";

function Optiuni({ onDelete, onArchive }) {
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
            <button
                className="icon-button"
                onClick={() => {
                    console.log("📦 Ai apăsat pe ARHIVARE");
                    if (onArchive) onArchive();
                }}
            >
                <img
                    src="/Archive.png"
                    alt="Archive icon"
                    className="icon-image"
                />
            </button>
        </div>
    );
}

export default Optiuni;