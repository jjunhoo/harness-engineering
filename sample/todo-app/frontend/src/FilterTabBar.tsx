import type { TodoFilter } from "./todoView";

type Counts = { all: number; active: number; completed: number };

type Props = {
  filter: TodoFilter;
  counts: Counts;
  onFilter: (f: TodoFilter) => void;
};

export function FilterTabBar({ filter, counts, onFilter }: Props) {
  function selectAll() {
    onFilter("all");
  }
  function selectActive() {
    onFilter("active");
  }
  function selectCompleted() {
    onFilter("completed");
  }

  return (
    <div className="app-tabs" role="tablist" aria-label="할 일 보기 필터">
      <button
        type="button"
        role="tab"
        id="tab-all"
        aria-selected={filter === "all"}
        aria-controls="todo-panel"
        className="app-tab"
        onClick={selectAll}
      >
        전체
        <span className="app-tab-count">{counts.all}</span>
      </button>
      <button
        type="button"
        role="tab"
        id="tab-active"
        aria-selected={filter === "active"}
        aria-controls="todo-panel"
        className="app-tab"
        onClick={selectActive}
      >
        진행
        <span className="app-tab-count">{counts.active}</span>
      </button>
      <button
        type="button"
        role="tab"
        id="tab-completed"
        aria-selected={filter === "completed"}
        aria-controls="todo-panel"
        className="app-tab"
        onClick={selectCompleted}
      >
        완료
        <span className="app-tab-count">{counts.completed}</span>
      </button>
    </div>
  );
}
