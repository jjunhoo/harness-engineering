import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { defaultHourMinuteForDateKey, localDateTimeToIso } from "./scheduleTime";

describe("localDateTimeToIso", () => {
  it("builds ISO from local calendar parts", () => {
    const iso = localDateTimeToIso("2026-04-20", 14, 30);
    const d = new Date(iso);
    expect(d.getFullYear()).toBe(2026);
    expect(d.getMonth()).toBe(3);
    expect(d.getDate()).toBe(20);
    expect(d.getHours()).toBe(14);
    expect(d.getMinutes()).toBe(30);
  });

  it("throws on invalid dateKey", () => {
    expect(() => localDateTimeToIso("bad", 0, 0)).toThrow(/invalid dateKey/);
  });
});

describe("defaultHourMinuteForDateKey", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 3, 20, 13, 17, 0));
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it("uses 09:00 when date is not today", () => {
    expect(defaultHourMinuteForDateKey("2026-04-21")).toEqual({ hour: 9, minute: 0 });
  });

  it("floors minutes to 5 for today", () => {
    expect(defaultHourMinuteForDateKey("2026-04-20")).toEqual({ hour: 13, minute: 15 });
  });
});
