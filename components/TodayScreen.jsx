"use client";

import TaskItem from "./TaskItem";
import { isOverdue } from "../lib/dateUtils";

export default function TodayScreen({ tasks, todayIso, onToggleDone, onDelete, onGoToCapture }) {
  const relevant = tasks.filter(
    (t) => !t.done && (t.dueDate === todayIso || isOverdue(t.dueDate, todayIso))
  );
  const done = tasks.filter((t) => t.done && t.dueDate === todayIso);

  const sorted = [...relevant].sort((a, b) => {
    const aOver = isOverdue(a.dueDate, todayIso) ? 0 : 1;
    const bOver = isOverdue(b.dueDate, todayIso) ? 0 : 1;
    if (aOver !== bOver) return aOver - bOver;
    return (a.time ?? "99:99").localeCompare(b.time ?? "99:99");
  });

  if (relevant.length === 0 && done.length === 0) {
    return (
      <div className="empty-state">
        <div className="emoji">☀️</div>
        <h3>На сьогодні нічого не заплановано</h3>
        <p>
          Вивали, що в голові, у Capture — AI розкладе це по датах, і
          сьогоднішні задачі з'являться тут самі.
        </p>
        <button type="button" className="btn btn-primary" onClick={onGoToCapture}>
          Перейти в Capture
        </button>
      </div>
    );
  }

  return (
    <>
      {sorted.length > 0 && (
        <div className="task-list">
          {sorted.map((task) => (
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

      {done.length > 0 && (
        <>
          <div className="section-title">Виконано сьогодні</div>
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
        </>
      )}
    </>
  );
}
