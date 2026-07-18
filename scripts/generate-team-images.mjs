// Kickoff Cards — AI card-art generator for national teams.
//
// Generates one full-bleed portrait PNG per nation (matching the player card art
// in public/cards/*.png) using OpenAI's image model. Kit colours + flag come
// straight from src/data/worldcup2026.js so the art stays on-brand.
//
// IMPORTANT (legal): prompts request a GENERIC, fictional athlete in plain
// flag-colour kit — no real-player likeness, no federation crests, no brand
// logos, no FIFA/World Cup marks. This keeps the art safe for public submission.
//
// Usage:
//   OPENAI_API_KEY=sk-...  node scripts/generate-team-images.mjs
//   node scripts/generate-team-images.mjs --force        # re-generate existing
//   node scripts/generate-team-images.mjs --only=Brazil,France
//
// Requires Node 18+ (built-in fetch). No npm dependencies.

import { mkdir, writeFile, access } from "node:fs/promises";
import { constants } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { TEAMS } from "../src/data/worldcup2026.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, "..", "public", "cards", "teams");

const API_KEY = process.env.OPENAI_API_KEY;
const MODEL = process.env.IMAGE_MODEL || "gpt-image-1";
const SIZE = process.env.IMAGE_SIZE || "1024x1536"; // portrait, ~5:7 card ratio

// --- CLI flags -------------------------------------------------------------
const args = process.argv.slice(2);
const FORCE = args.includes("--force");
const onlyArg = args.find((a) => a.startsWith("--only="));
const ONLY = onlyArg
  ? onlyArg.slice("--only=".length).split(",").map((s) => s.trim().toLowerCase())
  : null;

const slug = (name) =>
  name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const exists = (p) => access(p, constants.F_OK).then(() => true, () => false);

function promptFor(name, team) {
  return [
    `Collectible sports trading-card portrait of a FICTIONAL, generic male football (soccer) player representing ${name}.`,
    `He wears a plain team kit in the national colours ${team.primary} and ${team.secondary} — solid colours only, no crests, no logos, no sponsor text, no numbers.`,
    `Head-and-shoulders hero shot, confident expression, dramatic stadium floodlights and shallow depth of field behind him.`,
    `Cinematic, hyper-detailed, premium FUT-style card art, vertical composition, subject centered, filling the frame.`,
    `Do NOT depict any real, recognizable person. No brand marks, no FIFA or World Cup logos, no country flag graphics.`,
  ].join(" ");
}

async function generateOne(name, team) {
  const file = join(OUT_DIR, `${slug(name)}.png`);
  if (!FORCE && (await exists(file))) {
    console.log(`skip   ${name} (exists)`);
    return "skipped";
  }

  const res = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: MODEL,
      prompt: promptFor(name, team),
      size: SIZE,
      n: 1,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`${name}: ${res.status} ${res.statusText} — ${body.slice(0, 300)}`);
  }

  const data = await res.json();
  const b64 = data?.data?.[0]?.b64_json;
  if (!b64) throw new Error(`${name}: no image data in response`);

  await writeFile(file, Buffer.from(b64, "base64"));
  console.log(`ok     ${name} -> ${file}`);
  return "generated";
}

async function main() {
  if (!API_KEY) {
    console.error("Missing OPENAI_API_KEY. Run: OPENAI_API_KEY=sk-... node scripts/generate-team-images.mjs");
    process.exit(1);
  }
  await mkdir(OUT_DIR, { recursive: true });

  const names = Object.keys(TEAMS).filter(
    (n) => !ONLY || ONLY.includes(n.toLowerCase()),
  );
  console.log(`Generating ${names.length} team card(s) into ${OUT_DIR}\n`);

  let ok = 0, skipped = 0, failed = 0;
  for (const name of names) {
    try {
      const r = await generateOne(name, TEAMS[name]);
      r === "generated" ? ok++ : skipped++;
    } catch (err) {
      failed++;
      console.error(`FAIL   ${err.message}`);
    }
    // gentle pacing to stay under image rate limits
    await new Promise((r) => setTimeout(r, 1200));
  }

  console.log(`\nDone. generated=${ok} skipped=${skipped} failed=${failed}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
