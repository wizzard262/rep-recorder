import { useState } from "react";
import Collapse from "@mui/material/Collapse";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import type { RepSetScheme } from "~/types/rep-set-scheme-types";

// Every row the API returned, closed by default
export default function FullData({ data }: { data: RepSetScheme[] }) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button className="collapse-toggle" aria-expanded={open} onClick={() => setOpen(o => !o)}>
        <h2>Full Test Data <small style={{ fontFamily: "var(--sans)", fontSize: 14, color: "var(--muted)" }}>({data.length} rows)</small></h2>
        <ExpandMoreIcon className="chevron" />
      </button>

      <Collapse in={open} unmountOnExit>
        <div className="data-list">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Exercise Movement</th>
                <th>Category</th>
                <th className="num">Mass (Kg)</th>
                <th className="num">Reps</th>
                <th className="num">Volume</th>
              </tr>
            </thead>
            <tbody>
              {data.map(r => (
                <tr key={r.id}>
                  <td>{new Date(r.date).toLocaleDateString()}</td>
                  <td>{r.exerciseMovement.name}</td>
                  <td>{r.exerciseMovement.type}</td>
                  <td className="num">{r.kilogramMass}</td>
                  <td className="num">{r.repetitions}</td>
                  <td className="num">{r.kilogramMass * r.repetitions}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Collapse>
    </div>
  );
}
