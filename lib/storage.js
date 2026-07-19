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

// Профіль «отамана» і прапорець онбордингу. Це навмисно НЕ справжня
// авторизація (без пароля і бекенду) — акаунт живе на пристрої,
// хмарний auth винесено в роадмап.

const PROFILE_KEY = "jura.profile.v1";
const ONBOARDED_KEY = "jura.onboarded.v1";

export function loadProfile() {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(PROFILE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

export function saveProfile(profile) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  } catch (e) {}
}

export function clearProfile() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(PROFILE_KEY);
  } catch (e) {}
}

export function isOnboarded() {
  if (typeof window === "undefined") return true;
  try {
    return window.localStorage.getItem(ONBOARDED_KEY) === "1";
  } catch (e) {
    return true;
  }
}

export function setOnboarded() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(ONBOARDED_KEY, "1");
  } catch (e) {}
}

export function makeId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `t_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}
