// Проста персистентність MVP: усі задачі живуть у localStorage браузера.
// Без бекенд-БД навмисно — це не обмеження, а рішення для швидкого MVP.

const STORAGE_KEY = "todoforest.tasks.v1";

export function loadTasks() {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error("Не вдалося прочитати задачі з localStorage", e);
    return [];
  }
}

export function saveTasks(tasks) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (e) {
    console.error("Не вдалося зберегти задачі в localStorage", e);
  }
}

export function makeId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `t_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}
