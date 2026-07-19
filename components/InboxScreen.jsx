"use client";

import { useState } from "react";
import TaskItem from "./TaskItem";
import { ChestIcon } from "./icons";

const PRIORITY_ORDER = { high: 0, medium: 1, low: 2 };

export default function InboxScreen({
  tasks,
  todayIso,
  newIds = [],
  onToggleDone,
  onDelete,
  onEdit,
  onGoToCapture,
}) {
  const [showDone, setShowDone] = useState(false);

  // Порядок: протерміновані → сьогодні → майбутні (за датою) → без дати.
  // У межах одного дня — за пріоритетом, потім за часом.
  const bucketOf = (t) => {
    if (!t.dueDate) return 3;
    if (t.dueDate < todayIso) return 0;
    if (t.dueDate === todayIso) return 1;
    return 2;
  };

  const sorted = [...tasks].sort((a, b) => {
    const bDiff = bucketOf(a) - bucketOf(b);
    if (bDiff !== 0) return bDiff;
    if (a.dueDate && b.dueDate && a.dueDate !== b.dueDate) {
      return a.dueDate < b.dueDate ? -1 : 1;
    }
    const pDiff = PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
    if (pDiff !== 0) return pDiff;
    return (a.time ?? "99:99").localeCompare(b.time ?? "99:99");
  });

  const active = sorted.filter((t) => !t.done);
  const done = sorted.filter((t) => t.done);

  if (tasks.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">
          <ChestIcon size={44} />
        </div>
        <h3>В обозі порожньо</h3>
        <p>
          Гукни джурі, що в голові, — він розкладе все по задачах із датами й
          пріоритетами.
        </p>
        <button type="button" className="btn btn-primary" onClick={onGoToCapture}>
          Кажи джурі
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="task-list">
        {active.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            todayIso={todayIso}
            highlight={newIds.includes(task.id)}
            onToggleDone={onToggleDone}
            onDelete={onDelete}
            onEdit={onEdit}
          />
        ))}
      </div>

      {done.length > 0 && (
        <>
          <button
            type="button"
            className="done-toggle"
            onClick={() => setShowDone((v) => !v)}
          >
            <span>Виконано ({done.length})</span>
            <span>{showDone ? "▴" : "▾"}</span>
          </button>
          {showDone && (
            <div className="task-list">
              {done.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  todayIso={todayIso}
                  onToggleDone={onToggleDone}
                  onDelete={onDelete}
                />
              ))}
            </div>
          )}
        </>
      )}
    </>
  );
}
