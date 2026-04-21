import { describe, expect, it } from "vitest";
import {
  buildMonthWeeks,
  countActiveByDate,
  dayRouteParam,
  formatDayHeading,
  isValidDateKey,
  monthRangeKeys,
  parseDateKeyToParts,
  toDateKeyLocal,
} from "./calendarMonth";

describe("dayRouteParam", () => {
  it("uses empty string when param missing", () => {
    expect(dayRouteParam(undefined)).toBe("");
  });

  it("returns defined param", () => {
    expect(dayRouteParam("2026-04-01")).toBe("2026-04-01");
  });
});

describe("toDateKeyLocal / parseDateKeyToParts / isValidDateKey", () => {
  it("round-trips local date", () => {
    const d = new Date(2026, 3, 21);
    const k = toDateKeyLocal(d);
    expect(k).toBe("2026-04-21");
    expect(parseDateKeyToParts(k)).toEqual({ y: 2026, m: 4, day: 21 });
    expect(isValidDateKey(k)).toBe(true);
  });

  it("rejects invalid keys", () => {
    expect(isValidDateKey("")).toBe(false);
    expect(isValidDateKey("2026-13-01")).toBe(false);
    expect(isValidDateKey("2026-02-30")).toBe(false);
  });
});

describe("buildMonthWeeks", () => {
  it("April 2026 starts on Wednesday (pad 3)", () => {
    const w = buildMonthWeeks(2026, 3);
    expect(w[0].filter((c) => c.kind === "empty")).toHaveLength(3);
    const firstDay = w[0].find((c) => c.kind === "day");
    expect(firstDay && firstDay.kind === "day" && firstDay.date.getDate()).toBe(1);
  });
});

describe("monthRangeKeys", () => {
  it("returns first and last day of month", () => {
    expect(monthRangeKeys(2026, 3)).toEqual({ from: "2026-04-01", to: "2026-04-30" });
  });
});

describe("formatDayHeading", () => {
  it("formats Korean heading", () => {
    expect(formatDayHeading("2026-04-21")).toMatch(/2026/);
    expect(formatDayHeading("")).toBe("");
  });
});

describe("countActiveByDate", () => {
  it("counts only incomplete", () => {
    const m = countActiveByDate([
      { scheduledDate: "2026-04-01", completed: false },
      { scheduledDate: "2026-04-01", completed: true },
      { scheduledDate: "2026-04-02", completed: false },
    ]);
    expect(m["2026-04-01"]).toBe(1);
    expect(m["2026-04-02"]).toBe(1);
  });
});
