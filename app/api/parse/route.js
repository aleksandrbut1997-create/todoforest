import { buildSystemPrompt } from "../../../lib/prompt";
import { todayISO } from "../../../lib/dateUtils";

const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";
const MODEL = "claude-haiku-4-5-20251001";

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Некоректне тіло запиту" }, { status: 400 });
  }

  const rawText = typeof body?.text === "string" ? body.text.trim() : "";
  if (!rawText) {
    return Response.json({ error: "Порожній текст" }, { status: 400 });
  }

  // Клієнт передає свою локальну дату (щоб не залежати від таймзони сервера
  // Vercel). Якщо з якоїсь причини її немає — падаємо назад на серверну дату.
  const clientToday =
    typeof body?.todayIso === "string" && /^\d{4}-\d{2}-\d{2}$/.test(body.todayIso)
      ? body.todayIso
      : todayISO();

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return Response.json(
      { error: "ANTHROPIC_API_KEY не налаштований на сервері" },
      { status: 500 }
    );
  }

  const systemPrompt = buildSystemPrompt(clientToday);

  let anthropicRes;
  try {
    anthropicRes = await fetch(ANTHROPIC_API_URL, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 2048,
        system: systemPrompt,
        messages: [{ role: "user", content: rawText }],
      }),
    });
  } catch (e) {
    return Response.json(
      { error: "Не вдалося зв'язатися з Anthropic API", details: String(e) },
      { status: 502 }
    );
  }

  if (!anthropicRes.ok) {
    const errText = await anthropicRes.text().catch(() => "");
    return Response.json(
      { error: "Anthropic API повернув помилку", status: anthropicRes.status, details: errText },
      { status: 502 }
    );
  }

  const data = await anthropicRes.json();
  const textOut = data?.content?.[0]?.text ?? "";

  const tasks = parseTasksFromModelOutput(textOut);
  if (tasks === null) {
    return Response.json(
      { error: "Не вдалося розпарсити відповідь моделі", raw: textOut },
      { status: 502 }
    );
  }

  return Response.json({ tasks, todayIso: clientToday });
}

// Модель інколи обгортає JSON у ```json ... ``` або додає зайвий текст
// навколо — не довіряємо відповіді наосліп, вирізаємо і валідуємо.
function parseTasksFromModelOutput(text) {
  if (!text) return null;

  let candidate = text.trim();
  const fenceMatch = candidate.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenceMatch) {
    candidate = fenceMatch[1].trim();
  }

  const start = candidate.indexOf("[");
  const end = candidate.lastIndexOf("]");
  if (start === -1 || end === -1 || end < start) return null;
  candidate = candidate.slice(start, end + 1);

  let parsed;
  try {
    parsed = JSON.parse(candidate);
  } catch {
    return null;
  }
  if (!Array.isArray(parsed)) return null;

  const validPriorities = new Set(["high", "medium", "low"]);
  const isValidDate = (v) => v === null || /^\d{4}-\d{2}-\d{2}$/.test(v);
  const isValidTime = (v) => v === null || /^\d{2}:\d{2}$/.test(v);

  return parsed
    .filter((t) => t && typeof t.title === "string" && t.title.trim().length > 0)
    .map((t) => ({
      title: t.title.trim(),
      priority: validPriorities.has(t.priority) ? t.priority : "medium",
      dueDate: isValidDate(t.dueDate) ? t.dueDate : null,
      time: isValidTime(t.time) ? t.time : null,
      notes: typeof t.notes === "string" && t.notes.trim() ? t.notes.trim() : null,
    }));
}
