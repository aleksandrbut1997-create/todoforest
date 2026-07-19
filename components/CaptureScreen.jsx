"use client";

import { useEffect, useRef, useState } from "react";

export default function CaptureScreen({ onSubmit, isLoading, error, lastAddedCount }) {
  const [text, setText] = useState("");
  const [listening, setListening] = useState(false);
  const [micSupported, setMicSupported] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition =
      typeof window !== "undefined" &&
      (window.SpeechRecognition || window.webkitSpeechRecognition);
    if (!SpeechRecognition) {
      setMicSupported(false);
      return;
    }
    setMicSupported(true);

    const recognition = new SpeechRecognition();
    recognition.lang = "uk-UA";
    recognition.interimResults = false;
    recognition.continuous = true;

    recognition.onresult = (event) => {
      let chunk = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        chunk += event.results[i][0].transcript;
      }
      setText((prev) => (prev ? `${prev} ${chunk}` : chunk));
    };

    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);

    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
    };
  }, []);

  const toggleMic = () => {
    if (!recognitionRef.current) return;
    if (listening) {
      recognitionRef.current.stop();
      setListening(false);
    } else {
      recognitionRef.current.start();
      setListening(true);
    }
  };

  const handleSubmit = async () => {
    if (!text.trim() || isLoading) return;
    const ok = await onSubmit(text);
    if (ok) setText("");
  };

  return (
    <div className="capture-box">
      <textarea
        placeholder="Що в голові? Диктуй або пиши все підряд: «завтра подзвонити в банк, терміново відповісти клієнту, у п'ятницю здати звіт»…"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <div className="capture-actions">
        <button
          type="button"
          className="btn btn-primary"
          disabled={!text.trim() || isLoading}
          onClick={handleSubmit}
        >
          {isLoading ? "Розбираю…" : "Розібрати на задачі"}
        </button>
        {micSupported && (
          <button
            type="button"
            className={`btn btn-mic ${listening ? "listening" : ""}`}
            onClick={toggleMic}
            aria-label="Диктувати голосом"
          >
            🎤
          </button>
        )}
      </div>

      {error && <div className="error-box">{error}</div>}

      {!error && lastAddedCount > 0 && (
        <div className="hint">
          Додано задач: {lastAddedCount}. Дивись в Inbox або Today.
        </div>
      )}

      <div className="hint">
        AI сам визначить пріоритет, дедлайн і час для кожної задачі — не
        потрібно структурувати текст самому.
      </div>
    </div>
  );
}
