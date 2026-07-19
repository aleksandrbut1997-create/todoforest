"use client";

import { SabresIcon, SpeakIcon, ChestIcon, FlagIcon } from "./icons";

export default function Onboarding({ onStart, onSkip }) {
  return (
    <div className="gate">
      <div className="brand">
        <span className="brand-mark">
          <SabresIcon size={32} />
        </span>
        <h1 className="wordmark">Джура</h1>
      </div>
      <p className="gate-tag">
        Твій вірний помічник у справах.
        <br />
        Ти — отаман. Він — розбирається.
      </p>

      <div className="feature-card">
        <div className="feature-icon malyna">
          <SpeakIcon />
        </div>
        <div>
          <p className="feature-title">
            Кажи <span>· вивалюй усе</span>
          </p>
          <p className="feature-desc">
            Диктуй чи пиши все підряд, хоч десять справ одним реченням — джура
            не з лякливих. <b>Сам розбере на задачі</b> з датами, часом і
            пріоритетом.
          </p>
        </div>
      </div>

      <div className="feature-card">
        <div className="feature-icon zoloto">
          <ChestIcon />
        </div>
        <div>
          <p className="feature-title">
            Обоз <span>· увесь запас справ</span>
          </p>
          <p className="feature-desc">
            Тут усе розкладено по поличках: що <b>горить</b>, що <b>до діла</b>,
            а що <b>потерпить</b>. Джура схибив із датою? Тапни по задачі й
            поправ — він не образиться.
          </p>
        </div>
      </div>

      <div className="feature-card">
        <div className="feature-icon blakyt">
          <FlagIcon />
        </div>
        <div>
          <p className="feature-title">
            Похід <span>· план на сьогодні</span>
          </p>
          <p className="feature-desc">
            Щоранку — чіткий список: <b>що робимо сьогодні</b> і що вчора не
            добили. Ставиш ✓ — і на серці легшає. Прострочене джура нагадає без
            докорів. Майже.
          </p>
        </div>
      </div>

      <button type="button" className="btn btn-primary" onClick={onStart}>
        До діла, джуро!
      </button>
      <button type="button" className="gate-skip" onClick={onSkip}>
        Пропустити — сам розберуся
      </button>
    </div>
  );
}
