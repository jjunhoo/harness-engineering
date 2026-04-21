export type CalendarCell = { kind: "empty" } | { kind: "day"; date: Date };

/** 라우트 `:date` 파라미터가 없을 때 빈 문자열 */
export function dayRouteParam(date: string | undefined): string {
  return date ?? "";
}

/** 로컬 타임존 기준 YYYY-MM-DD */
export function toDateKeyLocal(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function parseDateKeyToParts(key: string): { y: number; m: number; day: number } | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(key);
  if (!m) return null;
  const y = Number(m[1], 10);
  const mo = Number(m[2], 10);
  const d = Number(m[3], 10);
  if (mo < 1 || mo > 12 || d < 1 || d > 31) return null;
  const dt = new Date(y, mo - 1, d);
  if (dt.getFullYear() !== y || dt.getMonth() !== mo - 1 || dt.getDate() !== d) return null;
  return { y, m: mo, day: d };
}

export function isValidDateKey(key: string): boolean {
  return parseDateKeyToParts(key) !== null;
}

/** 해당 월의 주 단위 그리드(일~토). 빈 칸은 `empty`. */
export function buildMonthWeeks(year: number, monthIndex0: number): CalendarCell[][] {
  const first = new Date(year, monthIndex0, 1);
  const startPad = first.getDay();
  const dim = new Date(year, monthIndex0 + 1, 0).getDate();
  const cells: CalendarCell[] = [];
  for (let i = 0; i < startPad; i++) cells.push({ kind: "empty" });
  for (let d = 1; d <= dim; d++) {
    cells.push({ kind: "day", date: new Date(year, monthIndex0, d) });
  }
  while (cells.length % 7 !== 0) cells.push({ kind: "empty" });
  const rows: CalendarCell[][] = [];
  for (let i = 0; i < cells.length; i += 7) {
    rows.push(cells.slice(i, i + 7));
  }
  return rows;
}

export function monthRangeKeys(year: number, monthIndex0: number): { from: string; to: string } {
  const first = new Date(year, monthIndex0, 1);
  const last = new Date(year, monthIndex0 + 1, 0);
  return { from: toDateKeyLocal(first), to: toDateKeyLocal(last) };
}

export function formatDayHeading(dateKey: string): string {
  const p = parseDateKeyToParts(dateKey);
  if (!p) return "";
  const d = new Date(p.y, p.m - 1, p.day);
  return d.toLocaleDateString("ko-KR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/** 미완료 할 일 개수를 날짜 키별로 집계 */
export function countActiveByDate(
  todos: { scheduledDate: string; completed: boolean }[],
): Record<string, number> {
  const acc: Record<string, number> = {};
  for (const t of todos) {
    if (t.completed) continue;
    acc[t.scheduledDate] = (acc[t.scheduledDate] ?? 0) + 1;
  }
  return acc;
}
