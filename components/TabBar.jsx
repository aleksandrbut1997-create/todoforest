"use client";

const TABS = [
  { id: "capture", label: "Capture", icon: "✍️" },
  { id: "inbox", label: "Inbox", icon: "📥" },
  { id: "today", label: "Today", icon: "☀️" },
];

export default function TabBar({ active, onChange, inboxCount, todayCount }) {
  const countFor = (id) =>
    id === "inbox" ? inboxCount : id === "today" ? todayCount : 0;

  return (
    <nav className="tab-bar">
      <div className="tab-bar-inner">
        {TABS.map((tab) => {
          const count = countFor(tab.id);
          return (
            <button
              key={tab.id}
              type="button"
              className={`tab-btn ${active === tab.id ? "active" : ""}`}
              onClick={() => onChange(tab.id)}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
              {count > 0 && <span className="badge">{count}</span>}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
