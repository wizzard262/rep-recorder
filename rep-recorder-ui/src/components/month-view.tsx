import { dayKey } from "~/utils/dates";

type MonthViewProps = {
  monthStart: Date;
  daysWithRecords: Set<string>;
  todayKey: string;
  isCurrent: boolean;
  isFuture: boolean;
};

export default function MonthView({ monthStart, daysWithRecords, todayKey, isCurrent, isFuture }: MonthViewProps) {
  const year = monthStart.getFullYear();
  const month = monthStart.getMonth();

  // First day of month (0 = Sunday)
  const firstDay = new Date(year, month, 1).getDay();

  // Number of days in month
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Build array of day numbers including leading blanks
  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const trainedCount = cells.filter(d => d != null && daysWithRecords.has(dayKey(new Date(year, month, d)))).length;

  const className = ["month", isCurrent && "current", isFuture && "future"].filter(Boolean).join(" ");

  return (
    <div className={className}>
      <h3>
        {monthStart.toLocaleString("default", { month: "long" })} {year}
        {trainedCount > 0 && <small>· {trainedCount} day{trainedCount === 1 ? "" : "s"}</small>}
      </h3>

      <div className="month-grid">
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
          <div key={i} className="dow">{d}</div>
        ))}

        {cells.map((day, i) => {
          if (day == null) return <div key={i} />;

          const key = dayKey(new Date(year, month, day));
          const classes = ["day", daysWithRecords.has(key) && "trained", key === todayKey && "today"]
            .filter(Boolean)
            .join(" ");

          return (
            <div key={i} className={classes}>
              {day}
            </div>
          );
        })}
      </div>
    </div>
  );
}
