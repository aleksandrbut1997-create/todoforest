// Прості лінійні SVG-іконки в козацькому стилі.
// Усі — stroke: currentColor, тож колір задається через CSS.

function Svg({ size = 22, children }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

/** Схрещені шаблі — знак «Джури» */
export function SabresIcon({ size = 26 }) {
  return (
    <Svg size={size}>
      <path d="M4 4c6 1 11 6 13 13" />
      <path d="M17 17l3 3" />
      <path d="M15.5 18.5l3-3" />
      <path d="M20 4c-6 1-11 6-13 13" />
      <path d="M7 17l-3 3" />
      <path d="M8.5 18.5l-3-3" />
    </Svg>
  );
}

/** Мовна бульбашка — вкладка «Кажи» */
export function SpeakIcon({ size = 22 }) {
  return (
    <Svg size={size}>
      <path d="M5 5h14a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-8l-4 4v-4H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z" />
    </Svg>
  );
}

/** Скриня — вкладка «Обоз» */
export function ChestIcon({ size = 22 }) {
  return (
    <Svg size={size}>
      <rect x="3" y="8" width="18" height="11" rx="2" />
      <path d="M3 13h18" />
      <path d="M12 12.5v2" />
    </Svg>
  );
}

/** Козацький прапорець — вкладка «Похід» */
export function FlagIcon({ size = 22 }) {
  return (
    <Svg size={size}>
      <path d="M6 21V4" />
      <path d="M6 4h12l-3 3.5 3 3.5H6" />
    </Svg>
  );
}

/** Мікрофон — диктування */
export function MicIcon({ size = 22 }) {
  return (
    <Svg size={size}>
      <path d="M12 3a3 3 0 0 1 3 3v5a3 3 0 0 1-6 0V6a3 3 0 0 1 3-3z" />
      <path d="M6 11a6 6 0 0 0 12 0" />
      <path d="M12 17v4" />
    </Svg>
  );
}
