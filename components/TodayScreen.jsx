"use client";

import TaskItem from "./TaskItem";
import { isOverdue } from "../lib/dateUtils";
import { FlagIcon } from "./icons";

export default function TodayScreen({
  tasks,
  todayIso,
  onToggleDone,
  onDelete,
  onGoToCapture,
}) {
  const relevant = tasks.filter(
    (t) => !t.done && (t.dueDate === todayIso || isOverdue(t.dueDate, todayIso))
  );
  const done = tasks.filter((t) => t.done && t.dueDate === todayIso);

  const byTime = (a, b) =>
    (a.time ?? "99:99").localeCompare(b.time ?? "99:99");

  const overdue = relevant
    .filter((t) => isOverdue(t.dueDate, todayIso))
    .sort((a, b) =>
      a.dueDate === b.dueDate ? byTime(a, b) : a.dueDate < b.dueDate ? -1 : 1
    );
  const todays = relevant
    .filter((t) => t.dueDate === todayIso)
    .sort(byTime);

  if (relevant.length === 0 && done.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">
          <FlagIcon size={44} />
        </div>
        <h3>Сьогодні походу нема</h3>
        <p>
          Кажи, що в голові, — джура розкладе справи по днях, і сьогоднішні
          з'являться тут самі.
        </p>
        <button type="button" className="btn btn-primary" onClick={onGoToCapture}>
          Кажи джурі
        </button>
      </div>
    );
  }

  return (
    <>
      {overdue.length > 0 && (
        <>
          <div className="section-title overdue">Протерміновані — наздогнати</div>
          <div className="task-list">
            {overdue.map((task) => (
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

      {todays.length > 0 && (
        <>
          <div className="section-title">Сьогодні</div>
          <div className="task-list">
            {todays.map((task) => (
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
