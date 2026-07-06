// Anthropic Claude integration for AI Moment Cards.
// Generates a tight 2-sentence pundit insight when a significant event fires.
// Falls back to a templated insight if the key is missing or the call fails, so
// the Moment Card is ALWAYS populated for the demo.

const RAW_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY;
// Treat the .env.example placeholder (or blank) as "no key" so we cleanly use
// local fallback insights instead of firing doomed 401 requests.
const API_KEY =
  RAW_KEY && !RAW_KEY.includes("your_") && RAW_KEY.trim().length > 10 ? RAW_KEY : null;
const MODEL = "claude-sonnet-4-6";

export const hasAnthropicKey = () => Boolean(API_KEY);

const TYPE_LABEL = {
  goal: "Goal",
  red: "Red card",
  yellow: "Yellow card",
  sub: "Substitution",
};

export function fallbackInsight(event, oddsShift) {
  const dir = oddsShift.after >= oddsShift.before ? "surges" : "slides";
  const label = TYPE_LABEL[event.type] || "Moment";
  const swing = Math.abs(Math.round(oddsShift.after - oddsShift.before));
  if (event.type === "goal") {
    return `${event.player} strikes for ${event.team} and the complexion of the match changes in an instant. The market now ${dir} ${swing} points, pricing ${event.team} as clear favourites to take this.`;
  }
  if (event.type === "red") {
    return `${event.team} are down to ten after ${event.player}'s dismissal, a hammer blow with so long still to play. Win probability ${dir} ${swing} points as the numerical edge reshapes the contest.`;
  }
  return `${label} for ${event.team} — ${event.player} at the heart of it as momentum tilts. The market ${dir} ${swing} points on the back of it.`;
}

export async function generateMomentInsight(event, oddsShift, matchContext) {
  if (!API_KEY) return fallbackInsight(event, oddsShift);

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": API_KEY,
        "anthropic-version": "2023-06-01",
        // Required to call the API directly from the browser.
        "anthropic-dangerous-direct-browser-access": "true",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 1000,
        messages: [
          {
            role: "user",
            content: `You are a football pundit explaining a match moment to a casual fan in 2 short sentences.
Be exciting but clear. No jargon. Focus on what this means for the match outcome.

Event: ${event.type} — ${event.team} (${event.minute}')
Player: ${event.player}
Odds shift: Win probability moved from ${oddsShift.before}% to ${oddsShift.after}%
Score: ${matchContext.score}

Write exactly 2 sentences. First sentence: what happened and why it matters tactically.
Second sentence: what the market now thinks will happen.`,
          },
        ],
      }),
    });

    if (!response.ok) throw new Error(`Anthropic ${response.status}`);
    const data = await response.json();
    const text = data?.content?.[0]?.text?.trim();
    return text || fallbackInsight(event, oddsShift);
  } catch (err) {
    console.warn("[anthropic] insight failed, using fallback:", err.message);
    return fallbackInsight(event, oddsShift);
  }
}
