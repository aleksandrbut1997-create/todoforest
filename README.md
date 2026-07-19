# TodoForest — AI-планер дня

Todoist-подібний планер: вивалюєш усе, що в голові, текстом або голосом —
AI сам перетворює хаос на структуровані задачі (пріоритет, дата, час) і
формує чіткий план на сьогодні. Детальний концепт і схема даних — у
[`PRD.md`](./PRD.md).

Живий сайт: https://todoforest-a.vercel.app/

## Стек

Next.js 14 (App Router) + React, без бекенд-БД — задачі зберігаються в
`localStorage` браузера. Один серверний ендпоінт `/api/parse` викликає
Claude (`claude-haiku-4-5`) для розбору тексту на задачі.

## Локальний запуск

```bash
npm install
cp .env.local.example .env.local   # і встав свій ANTHROPIC_API_KEY
npm run dev
```

Відкрий http://localhost:3000.

## Деплой

Проєкт підключено до Vercel через GitHub — кожен push у `main` деплоїться
автоматично. На Vercel потрібна одна env-змінна:

- `ANTHROPIC_API_KEY` — ключ із console.anthropic.com (Settings -> API keys).

Додай її в Project Settings -> Environment Variables на Vercel, інакше
`/api/parse` поверне 500.

## Структура

```
app/
  page.js            — три екрани: Capture / Inbox / Today
  api/parse/route.js — серверний парсинг тексту через Claude
components/          — UI-компоненти (TaskItem, CaptureScreen, ...)
lib/
  prompt.js          — системний промпт для AI (дата рахується на сервері)
  dateUtils.js        — робота з датами (today/tomorrow/weekday)
  storage.js          — persist задач у localStorage
PRD.md               — концепт, скоуп MVP, схема задачі
```
