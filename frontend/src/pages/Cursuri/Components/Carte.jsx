import React, { useState } from "react";
import "./Component.css";

const Carte = ({ userType, id, onImageChange }) => {
    const [imageSrc, setImageSrc] = useState("/Book.png");
    const [isCustomImage, setIsCustomImage] = useState(false);

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setImageSrc(e.target.result);
                setIsCustomImage(true);
                if (onImageChange) {
                    onImageChange(id, e.target.result); // Notificăm părinte despre schimbare
                }
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div
            className={`carte-container ${isCustomImage ? "custom-image" : ""}`}
        >
            <img
                src={imageSrc}
                alt="Carte curs"
                className={`carte-image ${isCustomImage ? "custom-image" : ""}`}
            />
            {(userType === "professor" || userType === "admin") && (
                <div className="image-upload">
                    <label htmlFor={`upload-button-${id}`} className="plus-button">
                        +
                    </label>
                    <input
                        id={`upload-button-${id}`}
                        type="file"
                        accept="image/*"
                        className="upload-input"
                        onChange={handleImageChange}
                    />
                </div>
            )}
        </div>
    );
};

export default Carte;