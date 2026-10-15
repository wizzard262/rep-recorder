import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import MonthView from "./month-view";
import { dayKey } from "~/utils/dates";
import type { RepSetScheme } from "~/types/rep-set-scheme-types";

const minMonthWidth = 220;
const gap = 16;
const futureMonths = 6; // months shown ahead of today
const pastMonths = 5;   // minimum months shown before today, even with no data
const swipeDistance = 40;

const monthIndex = (d: Date) => d.getFullYear() * 12 + d.getMonth();

export default function RepCalendar({ data }: { data: RepSetScheme[] }) {
  // Set of local YYYY-MM-DD strings for fast lookup, duplicates and time of day removed
  const daysWithRecords = useMemo(() => new Set(data.map(r => dayKey(new Date(r.date)))), [data]);

  const today = new Date();
  const todayKey = dayKey(today);
  const thisMonth = monthIndex(today);

  // Months run oldest on the left to the future on the right
  const months = useMemo(() => {
    const dataMonths = data.map(r => monthIndex(new Date(r.date)));
    const first = Math.min(thisMonth - pastMonths, ...dataMonths);
    const last = Math.max(thisMonth, ...dataMonths) + futureMonths;

    const list: Date[] = [];
    for (let m = first; m <= last; m++) list.push(new Date(Math.floor(m / 12), m % 12, 1));
    return list;
  }, [data, thisMonth]);

  // Work out how many months fit, and stretch them to fill the width exactly
  const viewportRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const visible = Math.max(1, Math.floor((width + gap) / (minMonthWidth + gap)));
  const monthWidth = width > 0 ? (width - gap * (visible - 1)) / visible : minMonthWidth;
  const maxStart = Math.max(0, months.length - visible);

  // Default view: this month near the right, with one future month peeking in
  const currentPos = months.findIndex(m => monthIndex(m) === thisMonth);
  const homeStart = Math.min(maxStart, Math.max(0, currentPos - visible + 2));

  const [start, setStart] = useState<number | null>(null);
  const shown = Math.min(maxStart, Math.max(0, start ?? homeStart));

  const go = (step: number) => setStart(Math.min(maxStart, Math.max(0, shown + step)));

  // Basic swipe on touch screens
  const touchX = useRef<number | null>(null);

  const trackStyle = {
    "--cal-month": `${monthWidth}px`,
    "--cal-gap": `${gap}px`,
    transform: `translateX(${-shown * (monthWidth + gap)}px)`,
    // no slide until the width is known, so the first paint doesn't sweep across
    ...(width > 0 ? {} : { transition: "none" }),
  } as CSSProperties;

  return (
    <div>
      <div className="cal-head">
        <h2>Training Calendar</h2>
        <div className="cal-controls">
          <Button size="small" variant="outlined" onClick={() => setStart(null)} disabled={shown === homeStart}>
            Today
          </Button>
          <IconButton aria-label="Earlier months" onClick={() => go(-1)} disabled={shown === 0}>
            <ChevronLeftIcon />
          </IconButton>
          <IconButton aria-label="Later months" onClick={() => go(1)} disabled={shown === maxStart}>
            <ChevronRightIcon />
          </IconButton>
        </div>
      </div>

      <div
        className="cal-viewport"
        ref={viewportRef}
        onTouchStart={e => (touchX.current = e.touches[0].clientX)}
        onTouchEnd={e => {
          if (touchX.current == null) return;
          const dx = e.changedTouches[0].clientX - touchX.current;
          if (Math.abs(dx) > swipeDistance) go(dx < 0 ? 1 : -1);
          touchX.current = null;
        }}
      >
        <div className="cal-track" style={trackStyle}>
          {months.map(monthStart => {
            const m = monthIndex(monthStart);
            return (
              <MonthView
                key={m}
                monthStart={monthStart}
                daysWithRecords={daysWithRecords}
                todayKey={todayKey}
                isCurrent={m === thisMonth}
                isFuture={m > thisMonth}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
