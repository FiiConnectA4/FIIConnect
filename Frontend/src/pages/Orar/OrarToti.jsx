import React, { useState, useEffect, useRef } from "react";
import "./OrarToti.css";

const OrarToti = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const toggleDropdown = () => {
        setIsDropdownOpen((prev) => !prev);
    };

    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsDropdownOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener("click", handleClickOutside);
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, []);

    return (
        <div className="orar-container">
            <h1 className="orar-title">Orar</h1>
            <div className="orar-buttons">
                <div className="dropdown-container" ref={dropdownRef}>
                    <button className="orar-button" onClick={toggleDropdown}>
                        Orar studenți
                    </button>
                    {isDropdownOpen && (
                        <div className="dropdown-menu">
                            <button className="dropdown-item">Anul 1</button>
                            <button className="dropdown-item">Anul 2</button>
                            <button className="dropdown-item">Anul 3</button>
                            <button className="dropdown-item">Master 1</button>
                            <button className="dropdown-item">Master 2</button>
                            <button className="dropdown-item">Școala doctorală</button>
                        </div>
                    )}
                </div>
                <button className="orar-button">Orar profesori</button>
                <button className="orar-button">Orar pe discipline de studiu</button>
                <button className="orar-button">Orar săli și alte resurse</button>
            </div>
        </div>
    );
};

export default OrarToti;