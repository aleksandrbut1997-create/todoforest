"use client";

import { SpeakIcon, ChestIcon, FlagIcon } from "./icons";

const TABS = [
  { id: "capture", label: "Кажи", Icon: SpeakIcon },
  { id: "inbox", label: "Обоз", Icon: ChestIcon },
  { id: "today", label: "Похід", Icon: FlagIcon },
];

export default function TabBar({ active, onChange, inboxCount, todayCount }) {
  const countFor = (id) =>
    id === "inbox" ? inboxCount : id === "today" ? todayCount : 0;

  return (
    <nav className="tab-bar">
      <div className="tab-bar-inner">
        {TABS.map(({ id, label, Icon }) => {
          const count = countFor(id);
          return (
            <button
              key={id}
              type="button"
              className={`tab-btn ${active === id ? "active" : ""}`}
              onClick={() => onChange(id)}
            >
              <Icon />
              <span>{label}</span>
              {count > 0 && <span className="badge">{count}</span>}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
