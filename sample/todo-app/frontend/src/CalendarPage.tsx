import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { fetchTodosBetween } from "./api";
import "./App.css";
import {
  buildMonthWeeks,
  countActiveByDate,
  monthRangeKeys,
  toDateKeyLocal,
  type CalendarCell,
} from "./calendarMonth";

function isSameLocalDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function CalendarPage() {
  const [cursor, setCursor] = useState(() => {
    const n = new Date();
    return { y: n.getFullYear(), m: n.getMonth() };
  });
  const [rangeTodos, setRangeTodos] = useState<Awaited<ReturnType<typeof fetchTodosBetween>>>([]);
  const [rangeError, setRangeError] = useState<string | null>(null);

  const { from, to } = monthRangeKeys(cursor.y, cursor.m);
  const weeks = useMemo(() => buildMonthWeeks(cursor.y, cursor.m), [cursor.y, cursor.m]);
  const activeByDate = useMemo(() => countActiveByDate(rangeTodos), [rangeTodos]);
  const today = new Date();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setRangeError(null);
        const data = await fetchTodosBetween(from, to);
        if (!cancelled) setRangeTodos(data);
      } catch (e) {
        if (!cancelled) {
          setRangeError(e instanceof Error ? e.message : "load failed");
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [from, to]);

  function prevMonth() {
    setCursor((c) => {
      if (c.m === 0) return { y: c.y - 1, m: 11 };
      return { y: c.y, m: c.m - 1 };
    });
  }

  function nextMonth() {
    setCursor((c) => {
      if (c.m === 11) return { y: c.y + 1, m: 0 };
      return { y: c.y, m: c.m + 1 };
    });
  }

  function labelMonth(): string {
    return new Date(cursor.y, cursor.m, 1).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
    });
  }

  function renderCell(cell: CalendarCell, idx: number) {
    if (cell.kind === "empty") {
      return <div key={`e-${idx}`} className="cal-cell cal-cell--empty" aria-hidden />;
    }
    const key = toDateKeyLocal(cell.date);
    const n = activeByDate[key] ?? 0;
    const isToday = isSameLocalDay(cell.date, today);
    return (
      <div key={key} className="cal-cell">
        <Link
          className={`cal-day-link${isToday ? " cal-day-link--today" : ""}`}
          to={`/day/${key}`}
          aria-label={`${key} 할 일 ${n}건`}
        >
          <span className="cal-day-num">{cell.date.getDate()}</span>
          {n > 0 ? <span className="cal-day-badge">{n}</span> : null}
        </Link>
      </div>
    );
  }

  return (
    <div className="app-page">
      <div className="app-card cal-card">
        <header className="app-header">
          <h1 className="app-title">일정</h1>
          <p className="app-subtitle">날짜를 눌러 해당 날의 할 일을 관리하세요.</p>
        </header>

        {rangeError && (
          <p className="app-alert" role="alert">
            {rangeError}
          </p>
        )}

        <div className="cal-toolbar">
          <button type="button" className="cal-step-btn" onClick={prevMonth} aria-label="이전 달">
            ‹
          </button>
          <h2 className="cal-month-label">{labelMonth()}</h2>
          <button type="button" className="cal-step-btn" onClick={nextMonth} aria-label="다음 달">
            ›
          </button>
        </div>

        <div className="cal-weekdays" aria-hidden>
          <span>일</span>
          <span>월</span>
          <span>화</span>
          <span>수</span>
          <span>목</span>
          <span>금</span>
          <span>토</span>
        </div>

        <div className="cal-grid" role="grid" aria-label={`${labelMonth()} 달력`}>
          {weeks.flatMap((row, ri) =>
            row.map((cell, ci) => renderCell(cell, ri * 7 + ci)),
          )}
        </div>
      </div>
    </div>
  );
}
