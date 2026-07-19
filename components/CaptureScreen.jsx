"use client";

import { useEffect, useRef, useState } from "react";
import { MicIcon } from "./icons";

export default function CaptureScreen({ onSubmit, isLoading, error }) {
  const [text, setText] = useState("");
  const [interim, setInterim] = useState("");
  const [listening, setListening] = useState(false);
  const [micSupported, setMicSupported] = useState(false);
  const [micError, setMicError] = useState(null);
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
    recognition.interimResults = true;
    recognition.continuous = true;

    recognition.onresult = (event) => {
      let finalChunk = "";
      let interimChunk = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) finalChunk += result[0].transcript;
        else interimChunk += result[0].transcript;
      }
      if (finalChunk.trim()) {
        setText((prev) =>
          prev ? `${prev} ${finalChunk.trim()}` : finalChunk.trim()
        );
      }
      setInterim(interimChunk.trim());
    };

    recognition.onerror = (event) => {
      setListening(false);
      setInterim("");
      if (
        event.error === "not-allowed" ||
        event.error === "service-not-allowed"
      ) {
        setMicError(
          "Джурі заборонили слухати. Дозволь доступ до мікрофона в налаштуваннях браузера і спробуй ще раз."
        );
      } else if (event.error !== "no-speech" && event.error !== "aborted") {
        setMicError("Мікрофон закашлявся. Спробуй ще раз або пиши текстом.");
      }
    };

    recognition.onend = () => {
      setListening(false);
      setInterim("");
    };

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
      setInterim("");
    } else {
      setMicError(null);
      try {
        recognitionRef.current.start();
        setListening(true);
      } catch (e) {
        setMicError("Мікрофон закашлявся. Спробуй ще раз або пиши текстом.");
      }
    }
  };

  const handleSubmit = async () => {
    if (!text.trim() || isLoading) return;
    if (listening && recognitionRef.current) {
      recognitionRef.current.stop();
    }
    const ok = await onSubmit(text);
    if (ok) setText("");
  };

  const displayValue =
    listening && interim ? (text ? `${text} ${interim}` : interim) : text;

  return (
    <div className="capture-box">
      <textarea
        placeholder="Кажи все підряд, як думається: «завтра на курінь їхати, шаблі поточити — терміново, у п'ятницю гінця до кошового слати» — джура розбере."
        value={displayValue}
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
            aria-label={listening ? "Зупинити диктування" : "Диктувати голосом"}
          >
            <MicIcon />
          </button>
        )}
      </div>

      {listening && (
        <div className="hint listening-hint">
          Джура слухає… кажи, а як договориш — тисни мікрофон ще раз.
        </div>
      )}

      {micError && <div className="error-box">{micError}</div>}
      {error && <div className="error-box">{error}</div>}

      <div className="hint">
        Джура сам поставить пріоритет, дату й час кожній справі — не треба
        нічого структурувати.
      </div>
    </div>
  );
}
