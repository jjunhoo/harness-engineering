import type { Todo } from "./api";

export type TodoFilter = "all" | "active" | "completed";

export function tabPanelLabelId(filter: TodoFilter): string {
  if (filter === "all") return "tab-all";
  if (filter === "active") return "tab-active";
  return "tab-completed";
}

/** ISO-8601(서버 `Instant`) → 화면용 “추가 시각” */
export function formatAddedAt(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString("ko-KR", {
    dateStyle: "medium",
    timeStyle: "medium",
  });
}

/** 일별 화면: 같은 날짜 제목 아래에는 시·분만 표시 */
export function formatScheduledTime(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString("ko-KR", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function scheduledAtSortKey(iso: string): number {
  const t = new Date(iso).getTime();
  return Number.isNaN(t) ? Number.POSITIVE_INFINITY : t;
}

/** 같은 날 목록: `scheduledAt` 오름차순(이른 시간이 위), 같으면 `id` 오름차순 */
export function sortTodosByScheduleThenId(items: Todo[]): Todo[] {
  return [...items].sort((a, b) => {
    const at = scheduledAtSortKey(a.scheduledAt);
    const bt = scheduledAtSortKey(b.scheduledAt);
    if (at !== bt) return at - bt;
    return a.id - b.id;
  });
}

export function countTodos(items: Todo[]): { all: number; active: number; completed: number } {
  return {
    all: items.length,
    active: items.filter((t) => !t.completed).length,
    completed: items.filter((t) => t.completed).length,
  };
}

export function filterTodos(sorted: Todo[], filter: TodoFilter): Todo[] {
  switch (filter) {
    case "active":
      return sorted.filter((t) => !t.completed);
    case "completed":
      return sorted.filter((t) => t.completed);
    default:
      return sorted;
  }
}

/** 목록·필터 상태에 따른 빈 화면 안내 문구 */
export function todoEmptyHint(
  sorted: Todo[],
  filtered: Todo[],
  filter: TodoFilter,
): string | null {
  if (sorted.length === 0) return "첫 할 일을 추가해 보세요.";
  if (filtered.length === 0) {
    if (filter === "active") return "진행 중인 할 일이 없습니다.";
    if (filter === "completed") return "완료된 할 일이 없습니다.";
  }
  return null;
}
