"use client";

import { useState } from "react";
import { SabresIcon } from "./icons";

export default function AuthScreen({ profile, onSave, onSkip, onLogout }) {
  const [name, setName] = useState(profile?.name ?? "");
  const [email, setEmail] = useState(profile?.email ?? "");
  const editing = Boolean(profile);

  const handleSave = () => {
    if (!name.trim()) return;
    onSave({ name: name.trim(), email: email.trim() || null });
  };

  return (
    <div className="gate">
      <div className="brand">
        <span className="brand-mark">
          <SabresIcon size={32} />
        </span>
        <h1 className="wordmark">Джура</h1>
      </div>
      <p className="gate-tag">
        {editing ? (
          <>Отамане, тут можна поправити грамоту.</>
        ) : (
          <>
            Ставай до лав!
            <br />
            Джура служитиме тобі вірою й правдою.
          </>
        )}
      </p>

      <div className="auth-field">
        <label htmlFor="jura-name">Як тебе звати</label>
        <input
          id="jura-name"
          type="text"
          placeholder="Отаман Олександр"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoComplete="name"
        />
      </div>

      <div className="auth-field">
        <label htmlFor="jura-email">Пошта (не обов'язково)</label>
        <input
          id="jura-email"
          type="email"
          placeholder="otaman@sich.ua"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
        />
      </div>

      <button
        type="button"
        className="btn btn-primary"
        disabled={!name.trim()}
        onClick={handleSave}
      >
        {editing ? "Зберегти" : "Вписатись у реєстр"}
      </button>

      {editing ? (
        <button type="button" className="btn btn-logout" onClick={onLogout}>
          Вийти з реєстру
        </button>
      ) : (
        <button type="button" className="gate-skip" onClick={onSkip}>
          Потім — спершу до справ
        </button>
      )}

      <p className="auth-note">
        Реєстр живе на цьому пристрої. Справжні акаунти з хмарною
        синхронізацією — попереду в роадмапі.
      </p>
    </div>
  );
}
