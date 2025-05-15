import React, { useState, useEffect } from "react";
import "./Component.css";

const Carte = ({ userType, id, onImageChange }) => {
    const [imageSrc, setImageSrc] = useState("/Book.png");
    const [isCustomImage, setIsCustomImage] = useState(false);

    // Adăugăm o referință statică pentru a ține evidența URL-urilor blob pe grupuri
    const blobGroupRef = React.useRef({
        group: Math.floor(id / 4), // Grupăm câte 4 imagini
        urls: new Map()
    });

    useEffect(() => {
        let mounted = true;
        const currentGroup = Math.floor(id / 4);

        // Curățăm URL-urile vechi dacă am trecut la alt grup
        if (blobGroupRef.current.group !== currentGroup) {
            blobGroupRef.current.urls.forEach(url => URL.revokeObjectURL(url));
            blobGroupRef.current.urls.clear();
            blobGroupRef.current.group = currentGroup;
        }

        const fetchImage = async () => {
            const token = localStorage.getItem("token");
            try {
                const response = await fetch(`/didactic/course/${id}/icon.png`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    setImageSrc("/Book.png");
                    setIsCustomImage(false);
                    return;
                }

                const blob = await response.blob();
                if (mounted) {
                    // Curățăm URL-ul vechi pentru acest ID dacă există
                    if (blobGroupRef.current.urls.has(id)) {
                        URL.revokeObjectURL(blobGroupRef.current.urls.get(id));
                    }

                    // Creăm noul URL și îl salvăm
                    const newUrl = URL.createObjectURL(blob);
                    blobGroupRef.current.urls.set(id, newUrl);
                    setImageSrc(newUrl);
                    setIsCustomImage(true);
                }
            } catch {
                setImageSrc("/Book.png");
                setIsCustomImage(false);
            }
        };

        fetchImage();

        return () => {
            mounted = false;
            // Curățăm doar URL-ul pentru acest ID la unmount
            if (blobGroupRef.current.urls.has(id)) {
                URL.revokeObjectURL(blobGroupRef.current.urls.get(id));
                blobGroupRef.current.urls.delete(id);
            }
        };
    }, [id]);
    // Gestionarea încărcării unei imagini noi
    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (!file) {
            console.error("Nu a fost selectat niciun fișier.");
            return;
        }

        const token = localStorage.getItem("token");
        if (!token) {
            console.error("Token-ul lipsește. Utilizatorul nu este autentificat.");
            return;
        }

        // Șterge imaginea existentă înainte de a încărca una nouă
        fetch(`/didactic/course/${id}/icon`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => {
                if (!response.ok) {
                    console.warn("Eroare la ștergerea imaginii existente. Continuăm cu upload-ul.");
                }

                // După ștergere, încarcă imaginea nouă
                const formData = new FormData();
                formData.append("iconFile", file);

                return fetch(`/didactic/course/${id}/icon`, {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    body: formData,
                });
            })
            .then((response) => {
                if (!response.ok) throw new Error("Eroare la actualizarea imaginii");
                setImageSrc(`/didactic/course/${id}/icon.png?t=${new Date().getTime()}`); // Forțează reîncărcarea imaginii
                setIsCustomImage(true);
                if (onImageChange) {
                    onImageChange(id, `/didactic/course/${id}/icon.png`);
                }
            })
            .catch((error) => {
                console.error("Eroare la încărcarea imaginii:", error);
                setImageSrc("/Book.png");
                setIsCustomImage(false);
            });
    };

    // Ștergerea imaginii cursului
    const handleDeleteImage = () => {
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("Token-ul lipsește. Utilizatorul nu este autentificat.");
            return;
        }

        fetch(`/didactic/course/${id}/icon`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => {
                if (!response.ok) throw new Error("Eroare la ștergerea imaginii");
                setImageSrc("/Book.png"); // Actualizează imaginea afișată imediat
                setIsCustomImage(false);
            })
            .catch(() => {
                // În caz de eroare, setează imaginea implicită
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
                onError={() => setImageSrc("/Book.png")} // Fallback dacă imaginea nu se încarcă
            />
            {(userType === "professor" || userType === "admin") && (
                <div className="image-upload">
                    <button className="sterge-upload" onClick={handleDeleteImage}>x</button>
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