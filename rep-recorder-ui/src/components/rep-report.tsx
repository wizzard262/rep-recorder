import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer } from "recharts";
import type { RepSetScheme } from "~/types/rep-set-scheme-types";

const colours = [
  "#e6194b", // strong red
  "#3cb44b", // bright green
  "#0082c8", // deep blue
  "#f58231", // orange
  "#911eb4", // purple
  "#f032e6", // magenta
  "#d2f53c", // lime
  "#daaeae", // light pink
  "#008080", // teal
  "#aa6e28", // brown
  "#800000", // maroon
  "#aaffc3", // mint
  "#808000"  // olive
];

type ChartRow = { date: string } & Record<string, number | string>;

export default function RepReport({ data }: { data: RepSetScheme[] }) {
  // Transform API rows into flat rows
  const transformed = data.map(item => ({
    // Use ISO date for consistent X-axis
    date: new Date(item.date).toISOString().slice(0, 10),
    movement: item.exerciseMovement.name,
    volume: item.kilogramMass * item.repetitions
  }));

  // Pivot rows into Recharts format (leave missing values as null), sorted by date
  const byDate: Record<string, ChartRow> = {};
  transformed.forEach(r => {
    byDate[r.date] ??= { date: r.date };
    byDate[r.date][r.movement] = r.volume;
  });
  const chartData = Object.values(byDate).sort((a, b) => a.date.localeCompare(b.date));

  // Unique movement names for <Line />
  const movements = [...new Set(transformed.map(r => r.movement))];

  return (
    <div>
      <h2>Volume by Movement</h2>
      {data.length === 0 ? (
        <p>Loading Rep Set Schemes...</p>
      ) : (
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={chartData} margin={{ top: 8, right: 16, bottom: 0, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e3e2e8" />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Legend
              wrapperStyle={{ paddingTop: "10px", fontSize: "12px" }}
              iconType="circle"
              iconSize={10}
            />

            {movements.map((movement, i) => (
              <Line
                key={movement}
                type="linear"
                dataKey={movement}
                stroke={colours[i % colours.length]}
                strokeWidth={2}
                dot={false}
                connectNulls={true}   // ← THIS is the magic line
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
