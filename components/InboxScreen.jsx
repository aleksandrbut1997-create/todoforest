"use client";

import TaskItem from "./TaskItem";

const PRIORITY_ORDER = { high: 0, medium: 1, low: 2 };

export default function InboxScreen({ tasks, todayIso, onToggleDone, onDelete, onEdit, onGoToCapture }) {
  const sorted = [...tasks].sort((a, b) => {
    if (a.done !== b.done) return a.done ? 1 : -1;
    const pDiff = PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
    if (pDiff !== 0) return pDiff;
    if (a.dueDate && b.dueDate) return a.dueDate < b.dueDate ? -1 : 1;
    if (a.dueDate) return -1;
    if (b.dueDate) return 1;
    return 0;
  });

  if (tasks.length === 0) {
    return (
      <div className="empty-state">
        <div className="emoji">📥</div>
        <h3>Inbox порожній</h3>
        <p>
          Тут з'являється весь беклог задач, які AI розпарсив із твоїх
          нотаток. Почни з Capture.
        </p>
        <button type="button" className="btn btn-primary" onClick={onGoToCapture}>
          Перейти в Capture
        </button>
      </div>
    );
  }

  return (
    <div className="task-list">
      {sorted.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          todayIso={todayIso}
          onToggleDone={onToggleDone}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
}
