import type { Key, ReactElement, JSXElementConstructor, ReactNode, ReactPortal } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from "recharts";

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

export default function RepReport({ data }: { data: any[] }) {
  // Transform API rows into flat rows
  const transformData = (items: any[]) => {
    return items.map(item => ({
      // Use ISO date for consistent X-axis
      date: new Date(item.date).toISOString().slice(0, 10),
      movement: item.exerciseMovement.name,
      volume: item.kilogramMass * item.repetitions
    }));
  };

  // Pivot rows into Recharts format (leave missing values as null)
  const pivotForRecharts = (rows: any[]) => {
    const map: any = {};

    rows.forEach(r => {
      if (!map[r.date]) {
        map[r.date] = { date: r.date };
      }
      map[r.date][r.movement] = r.volume;
    });

    const pivoted = Object.values(map);

    // Sort by date
    pivoted.sort((a: any, b: any) => a.date.localeCompare(b.date));
    return pivoted;
  };

  const transformed = transformData(data);
  const chartData = pivotForRecharts(transformed);

  // Unique movement names for <Line />
  const movements = [...new Set(transformed.map(r => r.movement))];

  if (!data || data.length === 0) {
    return <p>Loading Rep Set Schemes...</p>;
  }

  return (
    <div style={{ textAlign: "left" }}>
      <LineChart width={900} height={400} data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend
          wrapperStyle={{
            paddingTop: "10px",
            fontSize: "12px",
            textAlign: "left"
          }}
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
      <div>
        <p><b>Rep Set Schemes loaded successfully.</b></p>
        <div style={{ fontSize: "10px" }}>
          {data.map((repSetScheme: { id: Key | null | undefined; date: string | number | Date; exerciseMovement: { name: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; }; kilogramMass: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; repetitions: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; }) => (
            <div key={repSetScheme.id}>
              <p>
                Date: {new Date(repSetScheme.date).toLocaleDateString()} –
                Exercise Movement: {repSetScheme.exerciseMovement.name} –
                Kilogram Mass: {repSetScheme.kilogramMass} –
                Repetitions: {repSetScheme.repetitions}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
