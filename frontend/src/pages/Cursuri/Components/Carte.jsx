import React, { useState, useEffect } from "react";
import "./Component.css";

const Carte = ({ userType, id, onImageChange }) => {
    const [imageSrc, setImageSrc] = useState("/Book.png");
    const [isCustomImage, setIsCustomImage] = useState(false);
    const urlRef = React.useRef(null);

    const cleanupUrl = () => {
        if (urlRef.current) {
            URL.revokeObjectURL(urlRef.current);
            urlRef.current = null;
        }
    };

    const createNewBlobUrl = (blob) => {
        cleanupUrl();
        const newUrl = URL.createObjectURL(blob);
        urlRef.current = newUrl;
        return newUrl;
    };

    useEffect(() => {
        let mounted = true;
        const timestamp = Date.now(); // Generăm timestamp-ul o singură dată

        const fetchImage = async () => {
            const token = localStorage.getItem("token");
            const url = `/didactic/course/${id}/icon.png`;

            try {
                const response = await fetch(url, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                console.log(`[FETCH] Răspuns pentru ID ${id}:`, response);

                if (!response.ok) {
                    const text = await response.text();
                    console.log(`[FETCH] Răspuns text pentru ID ${id}:`, text);
                    setImageSrc("/Book.png");
                    setIsCustomImage(false);
                    return;
                }

                const blob = await response.blob();
                console.log(blob);
                if (mounted) {
                    const newUrl = createNewBlobUrl(blob);
                    console.log(`[FETCH] Blob URL creat pentru ID ${id}:`, newUrl);
                    setImageSrc(newUrl);
                    setIsCustomImage(true);
                }
            } catch (err) {
                console.error(`[FETCH] Eroare la fetch pentru ID ${id}:`, err);
                setImageSrc("/Book.png");
                setIsCustomImage(false);
            }
        };
        fetchImage();

        return () => {
            mounted = false;
            cleanupUrl();
        };
    }, [id]);
    // Mutăm handleImageChange în afara useEffect
    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const token = localStorage.getItem("token");
        if (!token) return;

        console.log(`[UPLOAD] Încarc imagine pentru course ID: ${id}`);

        fetch(`/didactic/course/${id}/icon`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(() => {
                const formData = new FormData();
                formData.append("iconFile", file);
                return fetch(`/didactic/course/${id}/icon`, {
                    method: "PUT",
                    headers: { Authorization: `Bearer ${token}` },
                    body: formData,
                });
            })
            .then(response => {
                console.log(`[UPLOAD] Răspuns upload pentru ID ${id}:`, response);
                if (!response.ok) throw new Error("Eroare la actualizarea imaginii");
                return response.blob();
            })
            .then(blob => {
                if (urlRef.current) {
                    URL.revokeObjectURL(urlRef.current);
                }
                const newUrl = URL.createObjectURL(blob);
                urlRef.current = newUrl;
                setImageSrc(newUrl);
                setIsCustomImage(true);
                if (onImageChange) {
                    onImageChange(id, `/didactic/course/${id}/icon.png`);
                }
            })
            .catch(error => {
                console.error(`[UPLOAD] Eroare la încărcarea imaginii pentru ID ${id}:`, error);
                setImageSrc("/Book.png");
                setIsCustomImage(false);
            });
    };

    // Mutăm handleDeleteImage în afara useEffect
    const handleDeleteImage = () => {
        const token = localStorage.getItem("token");
        if (!token) return;

        fetch(`/didactic/course/${id}/icon`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(response => {
                if (!response.ok) throw new Error("Eroare la ștergerea imaginii");
                setImageSrc("/Book.png");
                setIsCustomImage(false);
            })
            .catch(() => {
                setImageSrc("/Book.png");
                setIsCustomImage(false);
            });
    };

    return (
        <div className={`carte-container ${isCustomImage ? "custom-image" : ""}`}>
            <img
                src={imageSrc}
                alt="Carte curs"
                className={`carte-image ${isCustomImage ? "custom-image" : ""}`}
                onError={() => setImageSrc("/Book.png")}
            />
            {(userType === "professor" || userType === "admin") && (
                <div className="image-upload">
                    <button className="sterge-upload" onClick={handleDeleteImage}>x</button>
                    <label htmlFor={`upload-button-${id}`} className="plus-button">+</label>
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