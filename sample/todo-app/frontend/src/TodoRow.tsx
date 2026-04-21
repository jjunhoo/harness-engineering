import type { Todo } from "./api";
import { formatAddedAt } from "./todoView";

type Props = {
  todo: Todo;
  onToggle: (todo: Todo) => void | Promise<void>;
  onDelete: (todo: Todo) => void | Promise<void>;
};

export function TodoRow({ todo, onToggle, onDelete }: Props) {
  function handleCheckboxChange() {
    void onToggle(todo);
  }
  function handleDeleteClick() {
    void onDelete(todo);
  }

  return (
    <li className="app-row">
      <input
        className="app-checkbox"
        type="checkbox"
        checked={todo.completed}
        onChange={handleCheckboxChange}
        aria-label={`완료: ${todo.title}`}
      />
      <div className="app-row-body">
        <div className={todo.completed ? "app-row-title app-row-title--done" : "app-row-title"}>
          {todo.title}
        </div>
        <div className="app-row-meta" aria-label={`추가 시각 ${formatAddedAt(todo.createdAt)}`}>
          {formatAddedAt(todo.createdAt)}
        </div>
      </div>
      <button
        type="button"
        className="app-btn-delete"
        onClick={handleDeleteClick}
        aria-label={`${todo.title} 삭제`}
      >
        삭제
      </button>
    </li>
  );
}

/** map 콜백을 분리해 커버리지·디버깅이 쉬운 형태로 유지 */
export function renderTodoRows(
  todos: Todo[],
  onToggle: (todo: Todo) => void | Promise<void>,
  onDelete: (todo: Todo) => void | Promise<void>,
): JSX.Element[] {
  return todos.map((todo) => (
    <TodoRow key={todo.id} todo={todo} onToggle={onToggle} onDelete={onDelete} />
  ));
}
