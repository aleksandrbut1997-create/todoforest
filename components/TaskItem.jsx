"use client";

import { formatDueLabel, isOverdue } from "../lib/dateUtils";

const PRIORITY_LABEL = { high: "терміново", medium: "звичайно", low: "не горить" };

export default function TaskItem({ task, todayIso, onToggleDone, onDelete, onEdit }) {
  const overdue = !task.done && isOverdue(task.dueDate, todayIso);

  return (
    <div className={`task-card ${task.done ? "done" : ""}`}>
      <button
        type="button"
        className={`checkbox ${task.done ? "checked" : ""}`}
        onClick={() => onToggleDone(task.id)}
        aria-label={task.done ? "Позначити невиконаною" : "Позначити виконаною"}
      >
        {task.done ? "✓" : ""}
      </button>

      <div className="task-main">
        <div className={`task-title ${task.done ? "done" : ""}`}>{task.title}</div>

        <div className="task-meta">
          <span className={`chip priority-${task.priority}`}>
            {PRIORITY_LABEL[task.priority] ?? task.priority}
          </span>
          <span className={`chip ${overdue ? "overdue" : ""}`}>
            {formatDueLabel(task.dueDate, todayIso)}
            {task.time ? ` · ${task.time}` : ""}
          </span>
        </div>

        {task.notes && <div className="task-notes">{task.notes}</div>}

        {onEdit && (
          <div className="date-edit">
            <input
              type="date"
              value={task.dueDate ?? ""}
              onChange={(e) => onEdit(task.id, { dueDate: e.target.value || null })}
            />
            <select
              value={task.priority}
              onChange={(e) => onEdit(task.id, { priority: e.target.value })}
            >
              <option value="high">терміново</option>
              <option value="medium">звичайно</option>
              <option value="low">не горить</option>
            </select>
          </div>
        )}
      </div>

      <div className="task-actions">
        <button
          type="button"
          className="icon-btn"
          onClick={() => onDelete(task.id)}
          aria-label="Видалити задачу"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
