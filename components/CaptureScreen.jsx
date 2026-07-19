"use client";

import { useEffect, useRef, useState } from "react";
import { MicIcon } from "./icons";

export default function CaptureScreen({ onSubmit, isLoading, error }) {
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
        placeholder="Кажи все підряд, як думається: «завтра на курінь їхати, шаблі поточити — терміново, у п'ятницю гінця до кошового слати» — джура розбере."
        value={text}
        disabled={isLoading}
        onChange={(e) => setText(e.target.value)}
      />

      <div className="capture-actions">
        <button
          type="button"
          className="btn btn-primary"
          disabled={!text.trim() || isLoading}
          onClick={handleSubmit}
        >
          {isLoading ? (
            <>
              <span className="spinner" />
              Слухаю, отамане…
            </>
          ) : (
            "Джуро, розбери!"
          )}
        </button>
        {micSupported && (
          <button
            type="button"
            className={`btn btn-mic ${listening ? "listening" : ""}`}
            onClick={toggleMic}
            aria-label="Диктувати голосом"
          >
            <MicIcon />
          </button>
        )}
      </div>

      {error && <div className="error-box">{error}</div>}

      <div className="hint">
        Джура сам поставить пріоритет, дату й час кожній справі — не треба
        нічого структурувати.
      </div>
    </div>
  );
}
