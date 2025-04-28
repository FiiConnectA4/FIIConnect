import React, { useState } from "react";

const OrarSecretariat = () => {
    const [schedule, setSchedule] = useState([]);
    const [newEntry, setNewEntry] = useState({ day: "", time: "", activity: "" });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewEntry({ ...newEntry, [name]: value });
    };

    const handleAddEntry = (e) => {
        e.preventDefault();
        setSchedule([...schedule, newEntry]);
        setNewEntry({ day: "", time: "", activity: "" });
    };

    return (
        <div>
            <h2>Modificare Orar</h2>
            <form onSubmit={handleAddEntry}>
                <label>
                    Ziua:
                    <input
                        type="text"
                        name="day"
                        value={newEntry.day}
                        onChange={handleInputChange}
                        placeholder="Introdu ziua"
                    />
                </label>
                <br />
                <label>
                    Ora:
                    <input
                        type="text"
                        name="time"
                        value={newEntry.time}
                        onChange={handleInputChange}
                        placeholder="Introdu ora"
                    />
                </label>
                <br />
                <label>
                    Activitate:
                    <input
                        type="text"
                        name="activity"
                        value={newEntry.activity}
                        onChange={handleInputChange}
                        placeholder="Introdu activitatea"
                    />
                </label>
                <br />
                <button type="submit">Adaugă</button>
            </form>

            <h3>Orar Curent</h3>
            <ul>
                {schedule.map((entry, index) => (
                    <li key={index}>
                        {entry.day}, {entry.time} - {entry.activity}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default OrarSecretariat;