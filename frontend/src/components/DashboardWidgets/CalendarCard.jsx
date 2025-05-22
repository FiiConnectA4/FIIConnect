// src/components/DashboardWidgets/CalendarCard.jsx
import './CalendarCard.css';

function CalendarCard() {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth(); // 0-indexed, aprilie=3
    const day = today.getDate();

    // Numele lunilor (poți traduce)
    const luni = [
        "Ianuarie", "Februarie", "Martie", "Aprilie", "Mai", "Iunie",
        "Iulie", "August", "Septembrie", "Octombrie", "Noiembrie", "Decembrie"
    ];

    // Câte zile are luna
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // În ce zi a săptămânii începe luna (luni=1, duminica=0)
    let firstDay = new Date(year, month, 1).getDay();
    if (firstDay === 0) firstDay = 7; // Duminica devine 7 (la final)

    // Generează un array pentru tabel
    let calendar = [];
    let week = new Array(firstDay - 1).fill(""); // umple începutul cu gol
    for (let d = 1; d <= daysInMonth; d++) {
        week.push(d);
        if (week.length === 7) {
            calendar.push(week);
            week = [];
        }
    }
    while (week.length < 7) week.push(""); // completează ultima săptămână
    if (week.some(x => x !== "")) calendar.push(week);

    return (
        <div className="calendar-card">
            <h3>{luni[month]} {year}</h3>
            <table>
                <thead>
                <tr>
                    <th>Du</th><th>Lu</th><th>Ma</th><th>Mi</th><th>Jo</th><th>Vi</th><th>Sâ</th>
                </tr>
                </thead>
                <tbody>
                {calendar.map((week, wi) => (
                    <tr key={wi}>
                        {week.map((d, di) => (
                            <td
                                key={di}
                                className={d === day ? "calendar-today" : ""}
                            >
                                {d}
                            </td>
                        ))}
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}
export default CalendarCard;
