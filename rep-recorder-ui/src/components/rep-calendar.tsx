import { useMemo } from "react";
import MonthView from "./month-view";

export default function RepCalendar({ data }: { data: any[] }) {
  // Convert rows into a Set of YYYY-MM-DD strings for fast lookup, remove duplicated and the time part of the date
const daysWithRecords = useMemo(() => {
  const set = new Set<string>();

  data.forEach(r => {
    const d = new Date(r.date);
    d.setHours(0, 0, 0, 0);
    set.add(d.toISOString().slice(0, 10)); // "YYYY-MM-DD"
  });

  return set;
}, [data]);


  // Determine min/max dates
  const { minDate, maxDate } = useMemo(() => {
    if (data.length === 0) return {};

    const dates = data.map(r => new Date(r.date));
    return {
      minDate: new Date((Math.min.apply(null, dates as any)) as any),
      maxDate: new Date((Math.max.apply(null, dates as any)) as any),
    };
  }, [data]);

  if (!minDate || !maxDate) return <p>No data</p>;

  // Build list of months between min and max
  const months = [];
  const cursor = new Date(minDate.getFullYear(), minDate.getMonth(), 1);

  while (cursor <= maxDate) {
    months.push(new Date(cursor));
    cursor.setMonth(cursor.getMonth() + 1);
  }

  // show most recent month first
  months.reverse();

  return (
    <div style={{ display: "grid", gap: "30px" }}>
      {months.map((monthStart, i) => (
        <MonthView
          key={i}
          monthStart={monthStart}
          daysWithRecords={daysWithRecords}
        />
      ))}
    </div>
  );
}
