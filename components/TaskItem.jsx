"use client";

import { useState } from "react";
import { formatDueLabel, isOverdue } from "../lib/dateUtils";

const PRIORITY_LABEL = { high: "горить", medium: "до діла", low: "потерпить" };

export default function TaskItem({
  task,
  todayIso,
  highlight,
  onToggleDone,
  onDelete,
  onEdit,
}) {
  const [editing, setEditing] = useState(false);
  const overdue = !task.done && isOverdue(task.dueDate, todayIso);

  return (
    <div
      className={`task-card ${task.done ? "done" : ""} ${
        highlight ? "flash" : ""
      }`}
    >
      <button
        type="button"
        className={`checkbox ${task.done ? "checked" : ""}`}
        onClick={() => onToggleDone(task.id)}
        aria-label={task.done ? "Позначити невиконаною" : "Позначити виконаною"}
      >
        {task.done ? "✓" : ""}
      </button>

      <div
        className={`task-main ${onEdit ? "editable" : ""}`}
        onClick={onEdit ? () => setEditing((v) => !v) : undefined}
      >
        <div className={`task-title ${task.done ? "done" : ""}`}>
          {task.title}
        </div>

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

        {onEdit && editing && (
          <div className="task-edit" onClick={(e) => e.stopPropagation()}>
            <input
              type="date"
              value={task.dueDate ?? ""}
              onChange={(e) =>
                onEdit(task.id, { dueDate: e.target.value || null })
              }
            />
            <input
              type="time"
              value={task.time ?? ""}
              onChange={(e) => onEdit(task.id, { time: e.target.value || null })}
            />
            <select
              value={task.priority}
              onChange={(e) => onEdit(task.id, { priority: e.target.value })}
            >
              <option value="high">горить</option>
              <option value="medium">до діла</option>
              <option value="low">потерпить</option>
            </select>
          </div>
        )}
      </div>

      <div className="task-actions">
        <button
          type="button"
          className="icon-btn"
          onClick={() => onDelete(task.id)}
          aria-label="Викреслити задачу"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
