"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import TabBar from "../components/TabBar";
import CaptureScreen from "../components/CaptureScreen";
import InboxScreen from "../components/InboxScreen";
import TodayScreen from "../components/TodayScreen";
import Onboarding from "../components/Onboarding";
import AuthScreen from "../components/AuthScreen";
import { SabresIcon } from "../components/icons";
import {
  loadTasks,
  saveTasks,
  makeId,
  loadProfile,
  saveProfile,
  clearProfile,
  isOnboarded,
  setOnboarded,
} from "../lib/storage";
import { todayISO, isOverdue } from "../lib/dateUtils";

export default function Home() {
  const [phase, setPhase] = useState("loading");
  const [tab, setTab] = useState("capture");
  const [tasks, setTasks] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);
  const [newIds, setNewIds] = useState([]);
  const toastTimer = useRef(null);
  const flashTimer = useRef(null);
  const todayIso = useMemo(() => todayISO(), []);

  useEffect(() => {
    setTasks(loadTasks());
    setProfile(loadProfile());
    setPhase(isOnboarded() ? "app" : "onboarding");
    setLoaded(true);
    return () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
      if (flashTimer.current) clearTimeout(flashTimer.current);
    };
  }, []);

  useEffect(() => {
    if (loaded) saveTasks(tasks);
  }, [tasks, loaded]);

  const showToast = (next) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast(next);
    toastTimer.current = setTimeout(() => setToast(null), 5000);
  };

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
        setError(data?.error || "Щось пішло не так. Спробуй ще раз, отамане.");
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
        setError(
          "Джура не розчув у тексті жодної задачі. Сформулюй конкретніше."
        );
        return false;
      }

      setTasks((prev) => [...prev, ...newTasks]);
      setNewIds(newTasks.map((t) => t.id));
      if (flashTimer.current) clearTimeout(flashTimer.current);
      flashTimer.current = setTimeout(() => setNewIds([]), 2600);
      setTab("inbox");
      showToast({ text: `Джура записав задач: ${newTasks.length}` });
      return true;
    } catch (e) {
      setError("Не догукатися до сервера. Перевір з'єднання і спробуй ще раз.");
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
    const idx = tasks.findIndex((t) => t.id === id);
    if (idx === -1) return;
    const removed = tasks[idx];
    setTasks((prev) => prev.filter((t) => t.id !== id));
    showToast({
      text: "Задачу викреслено",
      actionLabel: "Повернути",
      onAction: () => {
        setTasks((cur) => {
          const copy = [...cur];
          copy.splice(Math.min(idx, copy.length), 0, removed);
          return copy;
        });
        if (toastTimer.current) clearTimeout(toastTimer.current);
        setToast(null);
      },
    });
  };

  const editTask = (id, patch) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)));
  };

  const handleOnboardStart = () => {
    setOnboarded();
    setPhase("auth");
  };

  const handleOnboardSkip = () => {
    setOnboarded();
    setPhase("app");
  };

  const handleProfileSave = (next) => {
    const editing = Boolean(profile);
    saveProfile(next);
    setProfile(next);
    setPhase("app");
    showToast({
      text: editing ? "Грамоту оновлено" : `Вітаю в лавах, ${next.name}!`,
    });
  };

  const handleLogout = () => {
    clearProfile();
    setProfile(null);
    setPhase("app");
    showToast({ text: "Вийшов з реєстру. Задачі лишились на пристрої." });
  };

  const inboxCount = tasks.filter((t) => !t.done).length;
  const todayCount = tasks.filter(
    (t) => !t.done && (t.dueDate === todayIso || isOverdue(t.dueDate, todayIso))
  ).length;

  if (phase === "loading") return null;

  if (phase === "onboarding") {
    return <Onboarding onStart={handleOnboardStart} onSkip={handleOnboardSkip} />;
  }

  if (phase === "auth") {
    return (
      <AuthScreen
        profile={profile}
        onSave={handleProfileSave}
        onSkip={() => setPhase("app")}
        onLogout={handleLogout}
      />
    );
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="header-row">
          <div className="brand">
            <span className="brand-mark">
              <SabresIcon />
            </span>
            <h1 className="wordmark">Джура</h1>
          </div>
          <button
            type="button"
            className={`profile-btn ${profile ? "named" : ""}`}
            onClick={() => setPhase("auth")}
          >
            {profile ? profile.name : "Увійти"}
          </button>
        </div>
        <p>
          {tab === "capture" && "Кажи, отамане, — джура слухає"}
          {tab === "inbox" && "Обоз: увесь запас справ"}
          {tab === "today" && "Похід на сьогодні"}
        </p>
      </header>

      <main className="screen">
        {tab === "capture" && (
          <CaptureScreen
            onSubmit={handleSubmit}
            isLoading={isLoading}
            error={error}
          />
        )}
        {tab === "inbox" && (
          <InboxScreen
            tasks={tasks}
            todayIso={todayIso}
            newIds={newIds}
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

      {toast && (
        <div className="toast" role="status">
          <span>{toast.text}</span>
          {toast.actionLabel && (
            <button type="button" onClick={toast.onAction}>
              {toast.actionLabel}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
