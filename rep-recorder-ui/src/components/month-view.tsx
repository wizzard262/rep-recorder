export default function MonthView({ monthStart, daysWithRecords }: { monthStart: Date; daysWithRecords: Set<string> }) {
    const year = monthStart.getFullYear();
    const month = monthStart.getMonth();

    // First day of month (0 = Sunday)
    const firstDay = new Date(year, month, 1).getDay();

    // Number of days in month
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Build array of day numbers including leading blanks
    const cells = [];
    for (let i = 0; i < firstDay; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);

    return (
        <div>
            <h3 style={{ marginBottom: "10px" }}>
                {monthStart.toLocaleString("default", { month: "long" })} {year}
            </h3>

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(7, 1fr)",
                    gap: "4px",
                    textAlign: "center",
                }}
            >
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => (
                    <div key={d} style={{ fontWeight: "bold" }}>{d}</div>
                ))}

                {cells.map((day, i) => {
                    const dateStr =
                        day != null
                            ? new Date(year, month, day).toISOString().slice(0, 10)
                            : null;

                    const hasRecord = dateStr && daysWithRecords.has(dateStr);

                    return (
                        <div
                            key={i}
                            style={{
                                padding: "3px",
                                height: "24px",
                                border: "1px solid #ccc",
                                background: hasRecord ? "#ffd3d3" : "#f9f9f9",
                                color: hasRecord ? "black" : "#777",
                            }}
                        >
                            {hasRecord} {day}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
