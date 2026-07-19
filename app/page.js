"use client";

import { useEffect, useMemo, useState } from "react";
import TabBar from "../components/TabBar";
import CaptureScreen from "../components/CaptureScreen";
import InboxScreen from "../components/InboxScreen";
import TodayScreen from "../components/TodayScreen";
import { loadTasks, saveTasks, makeId } from "../lib/storage";
import { todayISO, isOverdue } from "../lib/dateUtils";

export default function Home() {
  const [tab, setTab] = useState("capture");
  const [tasks, setTasks] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastAddedCount, setLastAddedCount] = useState(0);
  const todayIso = useMemo(() => todayISO(), []);

  useEffect(() => {
    setTasks(loadTasks());
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) saveTasks(tasks);
  }, [tasks, loaded]);

  const handleSubmit = async (text) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/parse", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ text, todayIso }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data?.error || "Щось пішло не так під час розбору тексту.");
        return false;
      }

      const newTasks = (data.tasks || []).map((t) => ({
        id: makeId(),
        title: t.title,
        priority: t.priority,
        dueDate: t.dueDate,
        time: t.time,
        notes: t.notes,
        done: false,
        createdAt: new Date().toISOString(),
      }));

      if (newTasks.length === 0) {
        setError("AI не знайшов у тексті жодної задачі. Спробуй сформулювати конкретніше.");
        return false;
      }

      setTasks((prev) => [...prev, ...newTasks]);
      setLastAddedCount(newTasks.length);
      setTab("inbox");
      return true;
    } catch (e) {
      setError("Не вдалося зв'язатися із сервером. Перевір з'єднання і спробуй ще раз.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const toggleDone = (id) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  };

  const deleteTask = (id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const editTask = (id, patch) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)));
  };

  const inboxCount = tasks.filter((t) => !t.done).length;
  const todayCount = tasks.filter(
    (t) => !t.done && (t.dueDate === todayIso || isOverdue(t.dueDate, todayIso))
  ).length;

  return (
    <div className="app-shell">
      <header className="app-header">
        <h1>TodoForest</h1>
        <p>
          {tab === "capture" && "Вивали все, що в голові"}
          {tab === "inbox" && "Весь беклог задач"}
          {tab === "today" && "План на сьогодні"}
        </p>
      </header>

      <main className="screen">
        {tab === "capture" && (
          <CaptureScreen
            onSubmit={handleSubmit}
            isLoading={isLoading}
            error={error}
            lastAddedCount={lastAddedCount}
          />
        )}
        {tab === "inbox" && (
          <InboxScreen
            tasks={tasks}
            todayIso={todayIso}
            onToggleDone={toggleDone}
            onDelete={deleteTask}
            onEdit={editTask}
            onGoToCapture={() => setTab("capture")}
          />
        )}
        {tab === "today" && (
          <TodayScreen
            tasks={tasks}
            todayIso={todayIso}
            onToggleDone={toggleDone}
            onDelete={deleteTask}
            onGoToCapture={() => setTab("capture")}
          />
        )}
      </main>

      <TabBar
        active={tab}
        onChange={setTab}
        inboxCount={inboxCount}
        todayCount={todayCount}
      />
    </div>
  );
}
