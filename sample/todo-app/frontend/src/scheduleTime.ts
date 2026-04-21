import { toDateKeyLocal } from "./calendarMonth";

/** 오늘이 아니면 09:00, 오늘이면 현재 시각을 5분 단위로 내림 */
export function defaultHourMinuteForDateKey(dateKey: string): { hour: number; minute: number } {
  const now = new Date();
  if (toDateKeyLocal(now) !== dateKey) {
    return { hour: 9, minute: 0 };
  }
  const minute = Math.floor(now.getMinutes() / 5) * 5;
  return { hour: now.getHours(), minute };
}

/** `dateKey`(로컬 캘린더) + 시·분 → UTC 기준 ISO 문자열(API `Instant` 직렬화와 호환) */
export function localDateTimeToIso(dateKey: string, hour: number, minute: number): string {
  const parts = dateKey.split("-").map(Number);
  if (parts.length !== 3 || parts.some((n) => Number.isNaN(n))) {
    throw new Error(`invalid dateKey: ${dateKey}`);
  }
  const [y, mo, d] = parts;
  return new Date(y, mo - 1, d, hour, minute, 0, 0).toISOString();
}
