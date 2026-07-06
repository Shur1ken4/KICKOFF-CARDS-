# Country Cards — Claude Design prompt pack

Generation script for the 48 World Cup 2026 **country (TEAM-tier) cards**.
Each prompt produces one card in the *exact* format of the existing player
cards (e.g. `public/cards/messi.png`), so a country card drops straight into
the same deck. Art direction: **national crest on a flag-colour gradient** —
no player photos, so there is zero photo-licensing risk.

---

## 1. Card spec (identical for every card)

| Property | Value |
| --- | --- |
| Canvas | **832 × 1248 px**, portrait 2:3, PNG |
| Frame | Polished **gold metallic** border ~28 px thick, rounded corners (~40 px radius), soft bevel + inner highlight, thin near-black line between frame and art |
| Top-left badge | Circular flag medallion (~120 px), thin gold ring |
| Top-right badge | Gold rounded-rectangle pill (~150 × 70 px), bold white uppercase label **`TEAM`** |
| Main subject | The **national crest / football-federation emblem**, large, centered in the upper two-thirds |
| Background | Smooth diagonal gradient from the nation's **primary → secondary** flag colour, soft radial glow behind the crest, darkening to near-black in the lower third for text legibility |
| Name | Bottom, large **bold condensed uppercase white** sans-serif, centered |
| Accent bar | Thin horizontal **World Cup spectrum** bar directly under the name, left→right: `#A435F0 → #E0347A → #FF5A3C → #25C46A → #B6E84A` |
| Output file | `public/cards/<slug>.png` (slugs listed below) |

> Keep the frame, flag medallion, `TEAM` pill, name and spectrum bar **pixel-consistent** across all 48 so the set looks like one deck. Only the crest, the two gradient colours and the name change per card.

---

## 2. Master prompt template

Paste this, replacing the `{{...}}` tokens (per-country values are in section 4):

```
Design a premium collectible football trading card, 832x1248 px, portrait, PNG.

FRAME: polished gold metallic border ~28px thick with rounded corners and a
subtle bevel; a thin near-black line separates the frame from the artwork.

ARTWORK: the national football crest/emblem of {{COUNTRY}}, rendered large and
crisp, centered in the upper two-thirds. Background is a smooth diagonal
gradient from {{PRIMARY}} (top-left) to {{SECONDARY}} (bottom-right) with a soft
radial glow behind the crest. The lower third darkens to near-black for text.

TOP-LEFT: a circular medallion showing the {{COUNTRY}} flag, ringed in thin gold.
TOP-RIGHT: a gold rounded-rectangle pill with bold white uppercase text "TEAM".

NAME: at the bottom, the word "{{NAME_UPPER}}" in large bold condensed uppercase
white sans-serif, centered.

ACCENT BAR: directly beneath the name, a thin horizontal rainbow bar with a
left-to-right gradient #A435F0 -> #E0347A -> #FF5A3C -> #25C46A -> #B6E84A.

STYLE: clean, high-contrast, e-sports/FIFA-Ultimate-Team feel. No player
photos, no real people. Flat vector crest, not a mockup. Transparent-free,
full-bleed background inside the frame.
```

---

## 3. All 48 nations (grouped)

| Group | Nations |
| --- | --- |
| A | Mexico, Poland, Egypt, New Zealand |
| B | Canada, Croatia, Nigeria, Qatar |
| C | USA, Uruguay, Senegal, South Korea |
| D | England, Switzerland, Ecuador, Australia |
| E | Spain, Denmark, Japan, Costa Rica |
| F | France, Serbia, Morocco, Panama |
| G | Brazil, Portugal, Cameroon, Saudi |
| H | Argentina, Germany, Ghana, Iran |
| I | Netherlands, Colombia, Tunisia, Jamaica |
| J | Belgium, Italy, Ivory Coast, Norway |
| K | Uzbekistan, Peru, Wales, Algeria |
| L | Austria, Turkey, Paraguay, South Africa |

**Total: 48 teams** — the full 2026 field (48 nations, 12 groups of 4).

---

## 4. Ready-to-paste per-country prompts

### Group A

**Mexico** — `public/cards/team-mexico.png`

```
Design a premium collectible football trading card, 832x1248 px, portrait, PNG.
FRAME: polished gold metallic border ~28px thick, rounded corners, subtle bevel, thin near-black inner line.
ARTWORK: the national football crest/emblem of Mexico, large and crisp, centered in the upper two-thirds, on a smooth diagonal gradient from #006847 (top-left) to #CE1126 (bottom-right) with a soft radial glow behind the crest; lower third darkens to near-black.
TOP-LEFT: circular medallion of the Mexico flag (🇲🇽) ringed in thin gold.
TOP-RIGHT: gold rounded-rectangle pill with bold white uppercase text "TEAM".
NAME: at the bottom, "MEXICO" in large bold condensed uppercase white sans-serif, centered.
ACCENT BAR: beneath the name, a thin horizontal gradient bar #A435F0 -> #E0347A -> #FF5A3C -> #25C46A -> #B6E84A.
STYLE: clean high-contrast FIFA-Ultimate-Team feel, flat vector crest, no player photos, no real people, full-bleed background inside the frame.
```

**Poland** — `public/cards/team-poland.png`

```
Design a premium collectible football trading card, 832x1248 px, portrait, PNG.
FRAME: polished gold metallic border ~28px thick, rounded corners, subtle bevel, thin near-black inner line.
ARTWORK: the national football crest/emblem of Poland, large and crisp, centered in the upper two-thirds, on a smooth diagonal gradient from #DC143C (top-left) to #FFFFFF (bottom-right) with a soft radial glow behind the crest; lower third darkens to near-black.
TOP-LEFT: circular medallion of the Poland flag (🇵🇱) ringed in thin gold.
TOP-RIGHT: gold rounded-rectangle pill with bold white uppercase text "TEAM".
NAME: at the bottom, "POLAND" in large bold condensed uppercase white sans-serif, centered.
ACCENT BAR: beneath the name, a thin horizontal gradient bar #A435F0 -> #E0347A -> #FF5A3C -> #25C46A -> #B6E84A.
STYLE: clean high-contrast FIFA-Ultimate-Team feel, flat vector crest, no player photos, no real people, full-bleed background inside the frame.
```

**Egypt** — `public/cards/team-egypt.png`

```
Design a premium collectible football trading card, 832x1248 px, portrait, PNG.
FRAME: polished gold metallic border ~28px thick, rounded corners, subtle bevel, thin near-black inner line.
ARTWORK: the national football crest/emblem of Egypt, large and crisp, centered in the upper two-thirds, on a smooth diagonal gradient from #CE1126 (top-left) to #000000 (bottom-right) with a soft radial glow behind the crest; lower third darkens to near-black.
TOP-LEFT: circular medallion of the Egypt flag (🇪🇬) ringed in thin gold.
TOP-RIGHT: gold rounded-rectangle pill with bold white uppercase text "TEAM".
NAME: at the bottom, "EGYPT" in large bold condensed uppercase white sans-serif, centered.
ACCENT BAR: beneath the name, a thin horizontal gradient bar #A435F0 -> #E0347A -> #FF5A3C -> #25C46A -> #B6E84A.
STYLE: clean high-contrast FIFA-Ultimate-Team feel, flat vector crest, no player photos, no real people, full-bleed background inside the frame.
```

**New Zealand** — `public/cards/team-new-zealand.png`

```
Design a premium collectible football trading card, 832x1248 px, portrait, PNG.
FRAME: polished gold metallic border ~28px thick, rounded corners, subtle bevel, thin near-black inner line.
ARTWORK: the national football crest/emblem of New Zealand, large and crisp, centered in the upper two-thirds, on a smooth diagonal gradient from #00247D (top-left) to #CC142B (bottom-right) with a soft radial glow behind the crest; lower third darkens to near-black.
TOP-LEFT: circular medallion of the New Zealand flag (🇳🇿) ringed in thin gold.
TOP-RIGHT: gold rounded-rectangle pill with bold white uppercase text "TEAM".
NAME: at the bottom, "NEW ZEALAND" in large bold condensed uppercase white sans-serif, centered.
ACCENT BAR: beneath the name, a thin horizontal gradient bar #A435F0 -> #E0347A -> #FF5A3C -> #25C46A -> #B6E84A.
STYLE: clean high-contrast FIFA-Ultimate-Team feel, flat vector crest, no player photos, no real people, full-bleed background inside the frame.
```

### Group B

**Canada** — `public/cards/team-canada.png`

```
Design a premium collectible football trading card, 832x1248 px, portrait, PNG.
FRAME: polished gold metallic border ~28px thick, rounded corners, subtle bevel, thin near-black inner line.
ARTWORK: the national football crest/emblem of Canada, large and crisp, centered in the upper two-thirds, on a smooth diagonal gradient from #FF0000 (top-left) to #FFFFFF (bottom-right) with a soft radial glow behind the crest; lower third darkens to near-black.
TOP-LEFT: circular medallion of the Canada flag (🇨🇦) ringed in thin gold.
TOP-RIGHT: gold rounded-rectangle pill with bold white uppercase text "TEAM".
NAME: at the bottom, "CANADA" in large bold condensed uppercase white sans-serif, centered.
ACCENT BAR: beneath the name, a thin horizontal gradient bar #A435F0 -> #E0347A -> #FF5A3C -> #25C46A -> #B6E84A.
STYLE: clean high-contrast FIFA-Ultimate-Team feel, flat vector crest, no player photos, no real people, full-bleed background inside the frame.
```

**Croatia** — `public/cards/team-croatia.png`

```
Design a premium collectible football trading card, 832x1248 px, portrait, PNG.
FRAME: polished gold metallic border ~28px thick, rounded corners, subtle bevel, thin near-black inner line.
ARTWORK: the national football crest/emblem of Croatia, large and crisp, centered in the upper two-thirds, on a smooth diagonal gradient from #FF0000 (top-left) to #171796 (bottom-right) with a soft radial glow behind the crest; lower third darkens to near-black.
TOP-LEFT: circular medallion of the Croatia flag (🇭🇷) ringed in thin gold.
TOP-RIGHT: gold rounded-rectangle pill with bold white uppercase text "TEAM".
NAME: at the bottom, "CROATIA" in large bold condensed uppercase white sans-serif, centered.
ACCENT BAR: beneath the name, a thin horizontal gradient bar #A435F0 -> #E0347A -> #FF5A3C -> #25C46A -> #B6E84A.
STYLE: clean high-contrast FIFA-Ultimate-Team feel, flat vector crest, no player photos, no real people, full-bleed background inside the frame.
```

**Nigeria** — `public/cards/team-nigeria.png`

```
Design a premium collectible football trading card, 832x1248 px, portrait, PNG.
FRAME: polished gold metallic border ~28px thick, rounded corners, subtle bevel, thin near-black inner line.
ARTWORK: the national football crest/emblem of Nigeria, large and crisp, centered in the upper two-thirds, on a smooth diagonal gradient from #008751 (top-left) to #FFFFFF (bottom-right) with a soft radial glow behind the crest; lower third darkens to near-black.
TOP-LEFT: circular medallion of the Nigeria flag (🇳🇬) ringed in thin gold.
TOP-RIGHT: gold rounded-rectangle pill with bold white uppercase text "TEAM".
NAME: at the bottom, "NIGERIA" in large bold condensed uppercase white sans-serif, centered.
ACCENT BAR: beneath the name, a thin horizontal gradient bar #A435F0 -> #E0347A -> #FF5A3C -> #25C46A -> #B6E84A.
STYLE: clean high-contrast FIFA-Ultimate-Team feel, flat vector crest, no player photos, no real people, full-bleed background inside the frame.
```

**Qatar** — `public/cards/team-qatar.png`

```
Design a premium collectible football trading card, 832x1248 px, portrait, PNG.
FRAME: polished gold metallic border ~28px thick, rounded corners, subtle bevel, thin near-black inner line.
ARTWORK: the national football crest/emblem of Qatar, large and crisp, centered in the upper two-thirds, on a smooth diagonal gradient from #8A1538 (top-left) to #FFFFFF (bottom-right) with a soft radial glow behind the crest; lower third darkens to near-black.
TOP-LEFT: circular medallion of the Qatar flag (🇶🇦) ringed in thin gold.
TOP-RIGHT: gold rounded-rectangle pill with bold white uppercase text "TEAM".
NAME: at the bottom, "QATAR" in large bold condensed uppercase white sans-serif, centered.
ACCENT BAR: beneath the name, a thin horizontal gradient bar #A435F0 -> #E0347A -> #FF5A3C -> #25C46A -> #B6E84A.
STYLE: clean high-contrast FIFA-Ultimate-Team feel, flat vector crest, no player photos, no real people, full-bleed background inside the frame.
```

### Group C

**USA** — `public/cards/team-usa.png`

```
Design a premium collectible football trading card, 832x1248 px, portrait, PNG.
FRAME: polished gold metallic border ~28px thick, rounded corners, subtle bevel, thin near-black inner line.
ARTWORK: the national football crest/emblem of USA, large and crisp, centered in the upper two-thirds, on a smooth diagonal gradient from #3C3B6E (top-left) to #B22234 (bottom-right) with a soft radial glow behind the crest; lower third darkens to near-black.
TOP-LEFT: circular medallion of the USA flag (🇺🇸) ringed in thin gold.
TOP-RIGHT: gold rounded-rectangle pill with bold white uppercase text "TEAM".
NAME: at the bottom, "USA" in large bold condensed uppercase white sans-serif, centered.
ACCENT BAR: beneath the name, a thin horizontal gradient bar #A435F0 -> #E0347A -> #FF5A3C -> #25C46A -> #B6E84A.
STYLE: clean high-contrast FIFA-Ultimate-Team feel, flat vector crest, no player photos, no real people, full-bleed background inside the frame.
```

**Uruguay** — `public/cards/team-uruguay.png`

```
Design a premium collectible football trading card, 832x1248 px, portrait, PNG.
FRAME: polished gold metallic border ~28px thick, rounded corners, subtle bevel, thin near-black inner line.
ARTWORK: the national football crest/emblem of Uruguay, large and crisp, centered in the upper two-thirds, on a smooth diagonal gradient from #0038A8 (top-left) to #FCD116 (bottom-right) with a soft radial glow behind the crest; lower third darkens to near-black.
TOP-LEFT: circular medallion of the Uruguay flag (🇺🇾) ringed in thin gold.
TOP-RIGHT: gold rounded-rectangle pill with bold white uppercase text "TEAM".
NAME: at the bottom, "URUGUAY" in large bold condensed uppercase white sans-serif, centered.
ACCENT BAR: beneath the name, a thin horizontal gradient bar #A435F0 -> #E0347A -> #FF5A3C -> #25C46A -> #B6E84A.
STYLE: clean high-contrast FIFA-Ultimate-Team feel, flat vector crest, no player photos, no real people, full-bleed background inside the frame.
```

**Senegal** — `public/cards/team-senegal.png`

```
Design a premium collectible football trading card, 832x1248 px, portrait, PNG.
FRAME: polished gold metallic border ~28px thick, rounded corners, subtle bevel, thin near-black inner line.
ARTWORK: the national football crest/emblem of Senegal, large and crisp, centered in the upper two-thirds, on a smooth diagonal gradient from #00853F (top-left) to #FDEF42 (bottom-right) with a soft radial glow behind the crest; lower third darkens to near-black.
TOP-LEFT: circular medallion of the Senegal flag (🇸🇳) ringed in thin gold.
TOP-RIGHT: gold rounded-rectangle pill with bold white uppercase text "TEAM".
NAME: at the bottom, "SENEGAL" in large bold condensed uppercase white sans-serif, centered.
ACCENT BAR: beneath the name, a thin horizontal gradient bar #A435F0 -> #E0347A -> #FF5A3C -> #25C46A -> #B6E84A.
STYLE: clean high-contrast FIFA-Ultimate-Team feel, flat vector crest, no player photos, no real people, full-bleed background inside the frame.
```

**South Korea** — `public/cards/team-south-korea.png`

```
Design a premium collectible football trading card, 832x1248 px, portrait, PNG.
FRAME: polished gold metallic border ~28px thick, rounded corners, subtle bevel, thin near-black inner line.
ARTWORK: the national football crest/emblem of South Korea, large and crisp, centered in the upper two-thirds, on a smooth diagonal gradient from #003478 (top-left) to #C60C30 (bottom-right) with a soft radial glow behind the crest; lower third darkens to near-black.
TOP-LEFT: circular medallion of the South Korea flag (🇰🇷) ringed in thin gold.
TOP-RIGHT: gold rounded-rectangle pill with bold white uppercase text "TEAM".
NAME: at the bottom, "SOUTH KOREA" in large bold condensed uppercase white sans-serif, centered.
ACCENT BAR: beneath the name, a thin horizontal gradient bar #A435F0 -> #E0347A -> #FF5A3C -> #25C46A -> #B6E84A.
STYLE: clean high-contrast FIFA-Ultimate-Team feel, flat vector crest, no player photos, no real people, full-bleed background inside the frame.
```

### Group D

**England** — `public/cards/team-england.png`

```
Design a premium collectible football trading card, 832x1248 px, portrait, PNG.
FRAME: polished gold metallic border ~28px thick, rounded corners, subtle bevel, thin near-black inner line.
ARTWORK: the national football crest/emblem of England, large and crisp, centered in the upper two-thirds, on a smooth diagonal gradient from #CF101A (top-left) to #FFFFFF (bottom-right) with a soft radial glow behind the crest; lower third darkens to near-black.
TOP-LEFT: circular medallion of the England flag (🏴) ringed in thin gold.
TOP-RIGHT: gold rounded-rectangle pill with bold white uppercase text "TEAM".
NAME: at the bottom, "ENGLAND" in large bold condensed uppercase white sans-serif, centered.
ACCENT BAR: beneath the name, a thin horizontal gradient bar #A435F0 -> #E0347A -> #FF5A3C -> #25C46A -> #B6E84A.
STYLE: clean high-contrast FIFA-Ultimate-Team feel, flat vector crest, no player photos, no real people, full-bleed background inside the frame.
```

**Switzerland** — `public/cards/team-switzerland.png`

```
Design a premium collectible football trading card, 832x1248 px, portrait, PNG.
FRAME: polished gold metallic border ~28px thick, rounded corners, subtle bevel, thin near-black inner line.
ARTWORK: the national football crest/emblem of Switzerland, large and crisp, centered in the upper two-thirds, on a smooth diagonal gradient from #D52B1E (top-left) to #FFFFFF (bottom-right) with a soft radial glow behind the crest; lower third darkens to near-black.
TOP-LEFT: circular medallion of the Switzerland flag (🇨🇭) ringed in thin gold.
TOP-RIGHT: gold rounded-rectangle pill with bold white uppercase text "TEAM".
NAME: at the bottom, "SWITZERLAND" in large bold condensed uppercase white sans-serif, centered.
ACCENT BAR: beneath the name, a thin horizontal gradient bar #A435F0 -> #E0347A -> #FF5A3C -> #25C46A -> #B6E84A.
STYLE: clean high-contrast FIFA-Ultimate-Team feel, flat vector crest, no player photos, no real people, full-bleed background inside the frame.
```

**Ecuador** — `public/cards/team-ecuador.png`

```
Design a premium collectible football trading card, 832x1248 px, portrait, PNG.
FRAME: polished gold metallic border ~28px thick, rounded corners, subtle bevel, thin near-black inner line.
ARTWORK: the national football crest/emblem of Ecuador, large and crisp, centered in the upper two-thirds, on a smooth diagonal gradient from #FFDD00 (top-left) to #034EA2 (bottom-right) with a soft radial glow behind the crest; lower third darkens to near-black.
TOP-LEFT: circular medallion of the Ecuador flag (🇪🇨) ringed in thin gold.
TOP-RIGHT: gold rounded-rectangle pill with bold white uppercase text "TEAM".
NAME: at the bottom, "ECUADOR" in large bold condensed uppercase white sans-serif, centered.
ACCENT BAR: beneath the name, a thin horizontal gradient bar #A435F0 -> #E0347A -> #FF5A3C -> #25C46A -> #B6E84A.
STYLE: clean high-contrast FIFA-Ultimate-Team feel, flat vector crest, no player photos, no real people, full-bleed background inside the frame.
```

**Australia** — `public/cards/team-australia.png`

```
Design a premium collectible football trading card, 832x1248 px, portrait, PNG.
FRAME: polished gold metallic border ~28px thick, rounded corners, subtle bevel, thin near-black inner line.
ARTWORK: the national football crest/emblem of Australia, large and crisp, centered in the upper two-thirds, on a smooth diagonal gradient from #00843D (top-left) to #FFCD00 (bottom-right) with a soft radial glow behind the crest; lower third darkens to near-black.
TOP-LEFT: circular medallion of the Australia flag (🇦🇺) ringed in thin gold.
TOP-RIGHT: gold rounded-rectangle pill with bold white uppercase text "TEAM".
NAME: at the bottom, "AUSTRALIA" in large bold condensed uppercase white sans-serif, centered.
ACCENT BAR: beneath the name, a thin horizontal gradient bar #A435F0 -> #E0347A -> #FF5A3C -> #25C46A -> #B6E84A.
STYLE: clean high-contrast FIFA-Ultimate-Team feel, flat vector crest, no player photos, no real people, full-bleed background inside the frame.
```

### Group E

**Spain** — `public/cards/team-spain.png`

```
Design a premium collectible football trading card, 832x1248 px, portrait, PNG.
FRAME: polished gold metallic border ~28px thick, rounded corners, subtle bevel, thin near-black inner line.
ARTWORK: the national football crest/emblem of Spain, large and crisp, centered in the upper two-thirds, on a smooth diagonal gradient from #AA151B (top-left) to #F1BF00 (bottom-right) with a soft radial glow behind the crest; lower third darkens to near-black.
TOP-LEFT: circular medallion of the Spain flag (🇪🇸) ringed in thin gold.
TOP-RIGHT: gold rounded-rectangle pill with bold white uppercase text "TEAM".
NAME: at the bottom, "SPAIN" in large bold condensed uppercase white sans-serif, centered.
ACCENT BAR: beneath the name, a thin horizontal gradient bar #A435F0 -> #E0347A -> #FF5A3C -> #25C46A -> #B6E84A.
STYLE: clean high-contrast FIFA-Ultimate-Team feel, flat vector crest, no player photos, no real people, full-bleed background inside the frame.
```

**Denmark** — `public/cards/team-denmark.png`

```
Design a premium collectible football trading card, 832x1248 px, portrait, PNG.
FRAME: polished gold metallic border ~28px thick, rounded corners, subtle bevel, thin near-black inner line.
ARTWORK: the national football crest/emblem of Denmark, large and crisp, centered in the upper two-thirds, on a smooth diagonal gradient from #C60C30 (top-left) to #FFFFFF (bottom-right) with a soft radial glow behind the crest; lower third darkens to near-black.
TOP-LEFT: circular medallion of the Denmark flag (🇩🇰) ringed in thin gold.
TOP-RIGHT: gold rounded-rectangle pill with bold white uppercase text "TEAM".
NAME: at the bottom, "DENMARK" in large bold condensed uppercase white sans-serif, centered.
ACCENT BAR: beneath the name, a thin horizontal gradient bar #A435F0 -> #E0347A -> #FF5A3C -> #25C46A -> #B6E84A.
STYLE: clean high-contrast FIFA-Ultimate-Team feel, flat vector crest, no player photos, no real people, full-bleed background inside the frame.
```

**Japan** — `public/cards/team-japan.png`

```
Design a premium collectible football trading card, 832x1248 px, portrait, PNG.
FRAME: polished gold metallic border ~28px thick, rounded corners, subtle bevel, thin near-black inner line.
ARTWORK: the national football crest/emblem of Japan, large and crisp, centered in the upper two-thirds, on a smooth diagonal gradient from #BC002D (top-left) to #FFFFFF (bottom-right) with a soft radial glow behind the crest; lower third darkens to near-black.
TOP-LEFT: circular medallion of the Japan flag (🇯🇵) ringed in thin gold.
TOP-RIGHT: gold rounded-rectangle pill with bold white uppercase text "TEAM".
NAME: at the bottom, "JAPAN" in large bold condensed uppercase white sans-serif, centered.
ACCENT BAR: beneath the name, a thin horizontal gradient bar #A435F0 -> #E0347A -> #FF5A3C -> #25C46A -> #B6E84A.
STYLE: clean high-contrast FIFA-Ultimate-Team feel, flat vector crest, no player photos, no real people, full-bleed background inside the frame.
```

**Costa Rica** — `public/cards/team-costa-rica.png`

```
Design a premium collectible football trading card, 832x1248 px, portrait, PNG.
FRAME: polished gold metallic border ~28px thick, rounded corners, subtle bevel, thin near-black inner line.
ARTWORK: the national football crest/emblem of Costa Rica, large and crisp, centered in the upper two-thirds, on a smooth diagonal gradient from #002B7F (top-left) to #CE1126 (bottom-right) with a soft radial glow behind the crest; lower third darkens to near-black.
TOP-LEFT: circular medallion of the Costa Rica flag (🇨🇷) ringed in thin gold.
TOP-RIGHT: gold rounded-rectangle pill with bold white uppercase text "TEAM".
NAME: at the bottom, "COSTA RICA" in large bold condensed uppercase white sans-serif, centered.
ACCENT BAR: beneath the name, a thin horizontal gradient bar #A435F0 -> #E0347A -> #FF5A3C -> #25C46A -> #B6E84A.
STYLE: clean high-contrast FIFA-Ultimate-Team feel, flat vector crest, no player photos, no real people, full-bleed background inside the frame.
```

### Group F

**France** — `public/cards/team-france.png`

```
Design a premium collectible football trading card, 832x1248 px, portrait, PNG.
FRAME: polished gold metallic border ~28px thick, rounded corners, subtle bevel, thin near-black inner line.
ARTWORK: the national football crest/emblem of France, large and crisp, centered in the upper two-thirds, on a smooth diagonal gradient from #0055A4 (top-left) to #EF4135 (bottom-right) with a soft radial glow behind the crest; lower third darkens to near-black.
TOP-LEFT: circular medallion of the France flag (🇫🇷) ringed in thin gold.
TOP-RIGHT: gold rounded-rectangle pill with bold white uppercase text "TEAM".
NAME: at the bottom, "FRANCE" in large bold condensed uppercase white sans-serif, centered.
ACCENT BAR: beneath the name, a thin horizontal gradient bar #A435F0 -> #E0347A -> #FF5A3C -> #25C46A -> #B6E84A.
STYLE: clean high-contrast FIFA-Ultimate-Team feel, flat vector crest, no player photos, no real people, full-bleed background inside the frame.
```

**Serbia** — `public/cards/team-serbia.png`

```
Design a premium collectible football trading card, 832x1248 px, portrait, PNG.
FRAME: polished gold metallic border ~28px thick, rounded corners, subtle bevel, thin near-black inner line.
ARTWORK: the national football crest/emblem of Serbia, large and crisp, centered in the upper two-thirds, on a smooth diagonal gradient from #C6363C (top-left) to #0C4076 (bottom-right) with a soft radial glow behind the crest; lower third darkens to near-black.
TOP-LEFT: circular medallion of the Serbia flag (🇷🇸) ringed in thin gold.
TOP-RIGHT: gold rounded-rectangle pill with bold white uppercase text "TEAM".
NAME: at the bottom, "SERBIA" in large bold condensed uppercase white sans-serif, centered.
ACCENT BAR: beneath the name, a thin horizontal gradient bar #A435F0 -> #E0347A -> #FF5A3C -> #25C46A -> #B6E84A.
STYLE: clean high-contrast FIFA-Ultimate-Team feel, flat vector crest, no player photos, no real people, full-bleed background inside the frame.
```

**Morocco** — `public/cards/team-morocco.png`

```
Design a premium collectible football trading card, 832x1248 px, portrait, PNG.
FRAME: polished gold metallic border ~28px thick, rounded corners, subtle bevel, thin near-black inner line.
ARTWORK: the national football crest/emblem of Morocco, large and crisp, centered in the upper two-thirds, on a smooth diagonal gradient from #006233 (top-left) to #C1272D (bottom-right) with a soft radial glow behind the crest; lower third darkens to near-black.
TOP-LEFT: circular medallion of the Morocco flag (🇲🇦) ringed in thin gold.
TOP-RIGHT: gold rounded-rectangle pill with bold white uppercase text "TEAM".
NAME: at the bottom, "MOROCCO" in large bold condensed uppercase white sans-serif, centered.
ACCENT BAR: beneath the name, a thin horizontal gradient bar #A435F0 -> #E0347A -> #FF5A3C -> #25C46A -> #B6E84A.
STYLE: clean high-contrast FIFA-Ultimate-Team feel, flat vector crest, no player photos, no real people, full-bleed background inside the frame.
```

**Panama** — `public/cards/team-panama.png`

```
Design a premium collectible football trading card, 832x1248 px, portrait, PNG.
FRAME: polished gold metallic border ~28px thick, rounded corners, subtle bevel, thin near-black inner line.
ARTWORK: the national football crest/emblem of Panama, large and crisp, centered in the upper two-thirds, on a smooth diagonal gradient from #005293 (top-left) to #D21034 (bottom-right) with a soft radial glow behind the crest; lower third darkens to near-black.
TOP-LEFT: circular medallion of the Panama flag (🇵🇦) ringed in thin gold.
TOP-RIGHT: gold rounded-rectangle pill with bold white uppercase text "TEAM".
NAME: at the bottom, "PANAMA" in large bold condensed uppercase white sans-serif, centered.
ACCENT BAR: beneath the name, a thin horizontal gradient bar #A435F0 -> #E0347A -> #FF5A3C -> #25C46A -> #B6E84A.
STYLE: clean high-contrast FIFA-Ultimate-Team feel, flat vector crest, no player photos, no real people, full-bleed background inside the frame.
```

### Group G

**Brazil** — `public/cards/team-brazil.png`

```
Design a premium collectible football trading card, 832x1248 px, portrait, PNG.
FRAME: polished gold metallic border ~28px thick, rounded corners, subtle bevel, thin near-black inner line.
ARTWORK: the national football crest/emblem of Brazil, large and crisp, centered in the upper two-thirds, on a smooth diagonal gradient from #009C3B (top-left) to #FFDF00 (bottom-right) with a soft radial glow behind the crest; lower third darkens to near-black.
TOP-LEFT: circular medallion of the Brazil flag (🇧🇷) ringed in thin gold.
TOP-RIGHT: gold rounded-rectangle pill with bold white uppercase text "TEAM".
NAME: at the bottom, "BRAZIL" in large bold condensed uppercase white sans-serif, centered.
ACCENT BAR: beneath the name, a thin horizontal gradient bar #A435F0 -> #E0347A -> #FF5A3C -> #25C46A -> #B6E84A.
STYLE: clean high-contrast FIFA-Ultimate-Team feel, flat vector crest, no player photos, no real people, full-bleed background inside the frame.
```

**Portugal** — `public/cards/team-portugal.png`

```
Design a premium collectible football trading card, 832x1248 px, portrait, PNG.
FRAME: polished gold metallic border ~28px thick, rounded corners, subtle bevel, thin near-black inner line.
ARTWORK: the national football crest/emblem of Portugal, large and crisp, centered in the upper two-thirds, on a smooth diagonal gradient from #006600 (top-left) to #FF0000 (bottom-right) with a soft radial glow behind the crest; lower third darkens to near-black.
TOP-LEFT: circular medallion of the Portugal flag (🇵🇹) ringed in thin gold.
TOP-RIGHT: gold rounded-rectangle pill with bold white uppercase text "TEAM".
NAME: at the bottom, "PORTUGAL" in large bold condensed uppercase white sans-serif, centered.
ACCENT BAR: beneath the name, a thin horizontal gradient bar #A435F0 -> #E0347A -> #FF5A3C -> #25C46A -> #B6E84A.
STYLE: clean high-contrast FIFA-Ultimate-Team feel, flat vector crest, no player photos, no real people, full-bleed background inside the frame.
```

**Cameroon** — `public/cards/team-cameroon.png`

```
Design a premium collectible football trading card, 832x1248 px, portrait, PNG.
FRAME: polished gold metallic border ~28px thick, rounded corners, subtle bevel, thin near-black inner line.
ARTWORK: the national football crest/emblem of Cameroon, large and crisp, centered in the upper two-thirds, on a smooth diagonal gradient from #007A5E (top-left) to #CE1126 (bottom-right) with a soft radial glow behind the crest; lower third darkens to near-black.
TOP-LEFT: circular medallion of the Cameroon flag (🇨🇲) ringed in thin gold.
TOP-RIGHT: gold rounded-rectangle pill with bold white uppercase text "TEAM".
NAME: at the bottom, "CAMEROON" in large bold condensed uppercase white sans-serif, centered.
ACCENT BAR: beneath the name, a thin horizontal gradient bar #A435F0 -> #E0347A -> #FF5A3C -> #25C46A -> #B6E84A.
STYLE: clean high-contrast FIFA-Ultimate-Team feel, flat vector crest, no player photos, no real people, full-bleed background inside the frame.
```

**Saudi** — `public/cards/team-saudi.png`

```
Design a premium collectible football trading card, 832x1248 px, portrait, PNG.
FRAME: polished gold metallic border ~28px thick, rounded corners, subtle bevel, thin near-black inner line.
ARTWORK: the national football crest/emblem of Saudi, large and crisp, centered in the upper two-thirds, on a smooth diagonal gradient from #006C35 (top-left) to #FFFFFF (bottom-right) with a soft radial glow behind the crest; lower third darkens to near-black.
TOP-LEFT: circular medallion of the Saudi flag (🇸🇦) ringed in thin gold.
TOP-RIGHT: gold rounded-rectangle pill with bold white uppercase text "TEAM".
NAME: at the bottom, "SAUDI" in large bold condensed uppercase white sans-serif, centered.
ACCENT BAR: beneath the name, a thin horizontal gradient bar #A435F0 -> #E0347A -> #FF5A3C -> #25C46A -> #B6E84A.
STYLE: clean high-contrast FIFA-Ultimate-Team feel, flat vector crest, no player photos, no real people, full-bleed background inside the frame.
```

### Group H

**Argentina** — `public/cards/team-argentina.png`

```
Design a premium collectible football trading card, 832x1248 px, portrait, PNG.
FRAME: polished gold metallic border ~28px thick, rounded corners, subtle bevel, thin near-black inner line.
ARTWORK: the national football crest/emblem of Argentina, large and crisp, centered in the upper two-thirds, on a smooth diagonal gradient from #74ACDF (top-left) to #FFFFFF (bottom-right) with a soft radial glow behind the crest; lower third darkens to near-black.
TOP-LEFT: circular medallion of the Argentina flag (🇦🇷) ringed in thin gold.
TOP-RIGHT: gold rounded-rectangle pill with bold white uppercase text "TEAM".
NAME: at the bottom, "ARGENTINA" in large bold condensed uppercase white sans-serif, centered.
ACCENT BAR: beneath the name, a thin horizontal gradient bar #A435F0 -> #E0347A -> #FF5A3C -> #25C46A -> #B6E84A.
STYLE: clean high-contrast FIFA-Ultimate-Team feel, flat vector crest, no player photos, no real people, full-bleed background inside the frame.
```

**Germany** — `public/cards/team-germany.png`

```
Design a premium collectible football trading card, 832x1248 px, portrait, PNG.
FRAME: polished gold metallic border ~28px thick, rounded corners, subtle bevel, thin near-black inner line.
ARTWORK: the national football crest/emblem of Germany, large and crisp, centered in the upper two-thirds, on a smooth diagonal gradient from #DD0000 (top-left) to #FFCE00 (bottom-right) with a soft radial glow behind the crest; lower third darkens to near-black.
TOP-LEFT: circular medallion of the Germany flag (🇩🇪) ringed in thin gold.
TOP-RIGHT: gold rounded-rectangle pill with bold white uppercase text "TEAM".
NAME: at the bottom, "GERMANY" in large bold condensed uppercase white sans-serif, centered.
ACCENT BAR: beneath the name, a thin horizontal gradient bar #A435F0 -> #E0347A -> #FF5A3C -> #25C46A -> #B6E84A.
STYLE: clean high-contrast FIFA-Ultimate-Team feel, flat vector crest, no player photos, no real people, full-bleed background inside the frame.
```

**Ghana** — `public/cards/team-ghana.png`

```
Design a premium collectible football trading card, 832x1248 px, portrait, PNG.
FRAME: polished gold metallic border ~28px thick, rounded corners, subtle bevel, thin near-black inner line.
ARTWORK: the national football crest/emblem of Ghana, large and crisp, centered in the upper two-thirds, on a smooth diagonal gradient from #006B3F (top-left) to #FCD116 (bottom-right) with a soft radial glow behind the crest; lower third darkens to near-black.
TOP-LEFT: circular medallion of the Ghana flag (🇬🇭) ringed in thin gold.
TOP-RIGHT: gold rounded-rectangle pill with bold white uppercase text "TEAM".
NAME: at the bottom, "GHANA" in large bold condensed uppercase white sans-serif, centered.
ACCENT BAR: beneath the name, a thin horizontal gradient bar #A435F0 -> #E0347A -> #FF5A3C -> #25C46A -> #B6E84A.
STYLE: clean high-contrast FIFA-Ultimate-Team feel, flat vector crest, no player photos, no real people, full-bleed background inside the frame.
```

**Iran** — `public/cards/team-iran.png`

```
Design a premium collectible football trading card, 832x1248 px, portrait, PNG.
FRAME: polished gold metallic border ~28px thick, rounded corners, subtle bevel, thin near-black inner line.
ARTWORK: the national football crest/emblem of Iran, large and crisp, centered in the upper two-thirds, on a smooth diagonal gradient from #239F40 (top-left) to #DA0000 (bottom-right) with a soft radial glow behind the crest; lower third darkens to near-black.
TOP-LEFT: circular medallion of the Iran flag (🇮🇷) ringed in thin gold.
TOP-RIGHT: gold rounded-rectangle pill with bold white uppercase text "TEAM".
NAME: at the bottom, "IRAN" in large bold condensed uppercase white sans-serif, centered.
ACCENT BAR: beneath the name, a thin horizontal gradient bar #A435F0 -> #E0347A -> #FF5A3C -> #25C46A -> #B6E84A.
STYLE: clean high-contrast FIFA-Ultimate-Team feel, flat vector crest, no player photos, no real people, full-bleed background inside the frame.
```

### Group I

**Netherlands** — `public/cards/team-netherlands.png`

```
Design a premium collectible football trading card, 832x1248 px, portrait, PNG.
FRAME: polished gold metallic border ~28px thick, rounded corners, subtle bevel, thin near-black inner line.
ARTWORK: the national football crest/emblem of Netherlands, large and crisp, centered in the upper two-thirds, on a smooth diagonal gradient from #FF6600 (top-left) to #21468B (bottom-right) with a soft radial glow behind the crest; lower third darkens to near-black.
TOP-LEFT: circular medallion of the Netherlands flag (🇳🇱) ringed in thin gold.
TOP-RIGHT: gold rounded-rectangle pill with bold white uppercase text "TEAM".
NAME: at the bottom, "NETHERLANDS" in large bold condensed uppercase white sans-serif, centered.
ACCENT BAR: beneath the name, a thin horizontal gradient bar #A435F0 -> #E0347A -> #FF5A3C -> #25C46A -> #B6E84A.
STYLE: clean high-contrast FIFA-Ultimate-Team feel, flat vector crest, no player photos, no real people, full-bleed background inside the frame.
```

**Colombia** — `public/cards/team-colombia.png`

```
Design a premium collectible football trading card, 832x1248 px, portrait, PNG.
FRAME: polished gold metallic border ~28px thick, rounded corners, subtle bevel, thin near-black inner line.
ARTWORK: the national football crest/emblem of Colombia, large and crisp, centered in the upper two-thirds, on a smooth diagonal gradient from #FCD116 (top-left) to #003893 (bottom-right) with a soft radial glow behind the crest; lower third darkens to near-black.
TOP-LEFT: circular medallion of the Colombia flag (🇨🇴) ringed in thin gold.
TOP-RIGHT: gold rounded-rectangle pill with bold white uppercase text "TEAM".
NAME: at the bottom, "COLOMBIA" in large bold condensed uppercase white sans-serif, centered.
ACCENT BAR: beneath the name, a thin horizontal gradient bar #A435F0 -> #E0347A -> #FF5A3C -> #25C46A -> #B6E84A.
STYLE: clean high-contrast FIFA-Ultimate-Team feel, flat vector crest, no player photos, no real people, full-bleed background inside the frame.
```

**Tunisia** — `public/cards/team-tunisia.png`

```
Design a premium collectible football trading card, 832x1248 px, portrait, PNG.
FRAME: polished gold metallic border ~28px thick, rounded corners, subtle bevel, thin near-black inner line.
ARTWORK: the national football crest/emblem of Tunisia, large and crisp, centered in the upper two-thirds, on a smooth diagonal gradient from #E70013 (top-left) to #FFFFFF (bottom-right) with a soft radial glow behind the crest; lower third darkens to near-black.
TOP-LEFT: circular medallion of the Tunisia flag (🇹🇳) ringed in thin gold.
TOP-RIGHT: gold rounded-rectangle pill with bold white uppercase text "TEAM".
NAME: at the bottom, "TUNISIA" in large bold condensed uppercase white sans-serif, centered.
ACCENT BAR: beneath the name, a thin horizontal gradient bar #A435F0 -> #E0347A -> #FF5A3C -> #25C46A -> #B6E84A.
STYLE: clean high-contrast FIFA-Ultimate-Team feel, flat vector crest, no player photos, no real people, full-bleed background inside the frame.
```

**Jamaica** — `public/cards/team-jamaica.png`

```
Design a premium collectible football trading card, 832x1248 px, portrait, PNG.
FRAME: polished gold metallic border ~28px thick, rounded corners, subtle bevel, thin near-black inner line.
ARTWORK: the national football crest/emblem of Jamaica, large and crisp, centered in the upper two-thirds, on a smooth diagonal gradient from #009B3A (top-left) to #FED100 (bottom-right) with a soft radial glow behind the crest; lower third darkens to near-black.
TOP-LEFT: circular medallion of the Jamaica flag (🇯🇲) ringed in thin gold.
TOP-RIGHT: gold rounded-rectangle pill with bold white uppercase text "TEAM".
NAME: at the bottom, "JAMAICA" in large bold condensed uppercase white sans-serif, centered.
ACCENT BAR: beneath the name, a thin horizontal gradient bar #A435F0 -> #E0347A -> #FF5A3C -> #25C46A -> #B6E84A.
STYLE: clean high-contrast FIFA-Ultimate-Team feel, flat vector crest, no player photos, no real people, full-bleed background inside the frame.
```

### Group J

**Belgium** — `public/cards/team-belgium.png`

```
Design a premium collectible football trading card, 832x1248 px, portrait, PNG.
FRAME: polished gold metallic border ~28px thick, rounded corners, subtle bevel, thin near-black inner line.
ARTWORK: the national football crest/emblem of Belgium, large and crisp, centered in the upper two-thirds, on a smooth diagonal gradient from #E30613 (top-left) to #FDDA24 (bottom-right) with a soft radial glow behind the crest; lower third darkens to near-black.
TOP-LEFT: circular medallion of the Belgium flag (🇧🇪) ringed in thin gold.
TOP-RIGHT: gold rounded-rectangle pill with bold white uppercase text "TEAM".
NAME: at the bottom, "BELGIUM" in large bold condensed uppercase white sans-serif, centered.
ACCENT BAR: beneath the name, a thin horizontal gradient bar #A435F0 -> #E0347A -> #FF5A3C -> #25C46A -> #B6E84A.
STYLE: clean high-contrast FIFA-Ultimate-Team feel, flat vector crest, no player photos, no real people, full-bleed background inside the frame.
```

**Italy** — `public/cards/team-italy.png`

```
Design a premium collectible football trading card, 832x1248 px, portrait, PNG.
FRAME: polished gold metallic border ~28px thick, rounded corners, subtle bevel, thin near-black inner line.
ARTWORK: the national football crest/emblem of Italy, large and crisp, centered in the upper two-thirds, on a smooth diagonal gradient from #008C45 (top-left) to #CD212A (bottom-right) with a soft radial glow behind the crest; lower third darkens to near-black.
TOP-LEFT: circular medallion of the Italy flag (🇮🇹) ringed in thin gold.
TOP-RIGHT: gold rounded-rectangle pill with bold white uppercase text "TEAM".
NAME: at the bottom, "ITALY" in large bold condensed uppercase white sans-serif, centered.
ACCENT BAR: beneath the name, a thin horizontal gradient bar #A435F0 -> #E0347A -> #FF5A3C -> #25C46A -> #B6E84A.
STYLE: clean high-contrast FIFA-Ultimate-Team feel, flat vector crest, no player photos, no real people, full-bleed background inside the frame.
```

**Ivory Coast** — `public/cards/team-ivory-coast.png`

```
Design a premium collectible football trading card, 832x1248 px, portrait, PNG.
FRAME: polished gold metallic border ~28px thick, rounded corners, subtle bevel, thin near-black inner line.
ARTWORK: the national football crest/emblem of Ivory Coast, large and crisp, centered in the upper two-thirds, on a smooth diagonal gradient from #FF8200 (top-left) to #009A44 (bottom-right) with a soft radial glow behind the crest; lower third darkens to near-black.
TOP-LEFT: circular medallion of the Ivory Coast flag (🇨🇮) ringed in thin gold.
TOP-RIGHT: gold rounded-rectangle pill with bold white uppercase text "TEAM".
NAME: at the bottom, "IVORY COAST" in large bold condensed uppercase white sans-serif, centered.
ACCENT BAR: beneath the name, a thin horizontal gradient bar #A435F0 -> #E0347A -> #FF5A3C -> #25C46A -> #B6E84A.
STYLE: clean high-contrast FIFA-Ultimate-Team feel, flat vector crest, no player photos, no real people, full-bleed background inside the frame.
```

**Norway** — `public/cards/team-norway.png`

```
Design a premium collectible football trading card, 832x1248 px, portrait, PNG.
FRAME: polished gold metallic border ~28px thick, rounded corners, subtle bevel, thin near-black inner line.
ARTWORK: the national football crest/emblem of Norway, large and crisp, centered in the upper two-thirds, on a smooth diagonal gradient from #BA0C2F (top-left) to #00205B (bottom-right) with a soft radial glow behind the crest; lower third darkens to near-black.
TOP-LEFT: circular medallion of the Norway flag (🇳🇴) ringed in thin gold.
TOP-RIGHT: gold rounded-rectangle pill with bold white uppercase text "TEAM".
NAME: at the bottom, "NORWAY" in large bold condensed uppercase white sans-serif, centered.
ACCENT BAR: beneath the name, a thin horizontal gradient bar #A435F0 -> #E0347A -> #FF5A3C -> #25C46A -> #B6E84A.
STYLE: clean high-contrast FIFA-Ultimate-Team feel, flat vector crest, no player photos, no real people, full-bleed background inside the frame.
```

### Group K

**Uzbekistan** — `public/cards/team-uzbekistan.png`

```
Design a premium collectible football trading card, 832x1248 px, portrait, PNG.
FRAME: polished gold metallic border ~28px thick, rounded corners, subtle bevel, thin near-black inner line.
ARTWORK: the national football crest/emblem of Uzbekistan, large and crisp, centered in the upper two-thirds, on a smooth diagonal gradient from #1EB53A (top-left) to #0099B5 (bottom-right) with a soft radial glow behind the crest; lower third darkens to near-black.
TOP-LEFT: circular medallion of the Uzbekistan flag (🇺🇿) ringed in thin gold.
TOP-RIGHT: gold rounded-rectangle pill with bold white uppercase text "TEAM".
NAME: at the bottom, "UZBEKISTAN" in large bold condensed uppercase white sans-serif, centered.
ACCENT BAR: beneath the name, a thin horizontal gradient bar #A435F0 -> #E0347A -> #FF5A3C -> #25C46A -> #B6E84A.
STYLE: clean high-contrast FIFA-Ultimate-Team feel, flat vector crest, no player photos, no real people, full-bleed background inside the frame.
```

**Peru** — `public/cards/team-peru.png`

```
Design a premium collectible football trading card, 832x1248 px, portrait, PNG.
FRAME: polished gold metallic border ~28px thick, rounded corners, subtle bevel, thin near-black inner line.
ARTWORK: the national football crest/emblem of Peru, large and crisp, centered in the upper two-thirds, on a smooth diagonal gradient from #D91023 (top-left) to #FFFFFF (bottom-right) with a soft radial glow behind the crest; lower third darkens to near-black.
TOP-LEFT: circular medallion of the Peru flag (🇵🇪) ringed in thin gold.
TOP-RIGHT: gold rounded-rectangle pill with bold white uppercase text "TEAM".
NAME: at the bottom, "PERU" in large bold condensed uppercase white sans-serif, centered.
ACCENT BAR: beneath the name, a thin horizontal gradient bar #A435F0 -> #E0347A -> #FF5A3C -> #25C46A -> #B6E84A.
STYLE: clean high-contrast FIFA-Ultimate-Team feel, flat vector crest, no player photos, no real people, full-bleed background inside the frame.
```

**Wales** — `public/cards/team-wales.png`

```
Design a premium collectible football trading card, 832x1248 px, portrait, PNG.
FRAME: polished gold metallic border ~28px thick, rounded corners, subtle bevel, thin near-black inner line.
ARTWORK: the national football crest/emblem of Wales, large and crisp, centered in the upper two-thirds, on a smooth diagonal gradient from #C8102E (top-left) to #00B140 (bottom-right) with a soft radial glow behind the crest; lower third darkens to near-black.
TOP-LEFT: circular medallion of the Wales flag (🏴) ringed in thin gold.
TOP-RIGHT: gold rounded-rectangle pill with bold white uppercase text "TEAM".
NAME: at the bottom, "WALES" in large bold condensed uppercase white sans-serif, centered.
ACCENT BAR: beneath the name, a thin horizontal gradient bar #A435F0 -> #E0347A -> #FF5A3C -> #25C46A -> #B6E84A.
STYLE: clean high-contrast FIFA-Ultimate-Team feel, flat vector crest, no player photos, no real people, full-bleed background inside the frame.
```

**Algeria** — `public/cards/team-algeria.png`

```
Design a premium collectible football trading card, 832x1248 px, portrait, PNG.
FRAME: polished gold metallic border ~28px thick, rounded corners, subtle bevel, thin near-black inner line.
ARTWORK: the national football crest/emblem of Algeria, large and crisp, centered in the upper two-thirds, on a smooth diagonal gradient from #006233 (top-left) to #D21034 (bottom-right) with a soft radial glow behind the crest; lower third darkens to near-black.
TOP-LEFT: circular medallion of the Algeria flag (🇩🇿) ringed in thin gold.
TOP-RIGHT: gold rounded-rectangle pill with bold white uppercase text "TEAM".
NAME: at the bottom, "ALGERIA" in large bold condensed uppercase white sans-serif, centered.
ACCENT BAR: beneath the name, a thin horizontal gradient bar #A435F0 -> #E0347A -> #FF5A3C -> #25C46A -> #B6E84A.
STYLE: clean high-contrast FIFA-Ultimate-Team feel, flat vector crest, no player photos, no real people, full-bleed background inside the frame.
```

### Group L

**Austria** — `public/cards/team-austria.png`

```
Design a premium collectible football trading card, 832x1248 px, portrait, PNG.
FRAME: polished gold metallic border ~28px thick, rounded corners, subtle bevel, thin near-black inner line.
ARTWORK: the national football crest/emblem of Austria, large and crisp, centered in the upper two-thirds, on a smooth diagonal gradient from #ED2939 (top-left) to #FFFFFF (bottom-right) with a soft radial glow behind the crest; lower third darkens to near-black.
TOP-LEFT: circular medallion of the Austria flag (🇦🇹) ringed in thin gold.
TOP-RIGHT: gold rounded-rectangle pill with bold white uppercase text "TEAM".
NAME: at the bottom, "AUSTRIA" in large bold condensed uppercase white sans-serif, centered.
ACCENT BAR: beneath the name, a thin horizontal gradient bar #A435F0 -> #E0347A -> #FF5A3C -> #25C46A -> #B6E84A.
STYLE: clean high-contrast FIFA-Ultimate-Team feel, flat vector crest, no player photos, no real people, full-bleed background inside the frame.
```

**Turkey** — `public/cards/team-turkey.png`

```
Design a premium collectible football trading card, 832x1248 px, portrait, PNG.
FRAME: polished gold metallic border ~28px thick, rounded corners, subtle bevel, thin near-black inner line.
ARTWORK: the national football crest/emblem of Turkey, large and crisp, centered in the upper two-thirds, on a smooth diagonal gradient from #E30A17 (top-left) to #FFFFFF (bottom-right) with a soft radial glow behind the crest; lower third darkens to near-black.
TOP-LEFT: circular medallion of the Turkey flag (🇹🇷) ringed in thin gold.
TOP-RIGHT: gold rounded-rectangle pill with bold white uppercase text "TEAM".
NAME: at the bottom, "TURKEY" in large bold condensed uppercase white sans-serif, centered.
ACCENT BAR: beneath the name, a thin horizontal gradient bar #A435F0 -> #E0347A -> #FF5A3C -> #25C46A -> #B6E84A.
STYLE: clean high-contrast FIFA-Ultimate-Team feel, flat vector crest, no player photos, no real people, full-bleed background inside the frame.
```

**Paraguay** — `public/cards/team-paraguay.png`

```
Design a premium collectible football trading card, 832x1248 px, portrait, PNG.
FRAME: polished gold metallic border ~28px thick, rounded corners, subtle bevel, thin near-black inner line.
ARTWORK: the national football crest/emblem of Paraguay, large and crisp, centered in the upper two-thirds, on a smooth diagonal gradient from #D52B1E (top-left) to #0038A8 (bottom-right) with a soft radial glow behind the crest; lower third darkens to near-black.
TOP-LEFT: circular medallion of the Paraguay flag (🇵🇾) ringed in thin gold.
TOP-RIGHT: gold rounded-rectangle pill with bold white uppercase text "TEAM".
NAME: at the bottom, "PARAGUAY" in large bold condensed uppercase white sans-serif, centered.
ACCENT BAR: beneath the name, a thin horizontal gradient bar #A435F0 -> #E0347A -> #FF5A3C -> #25C46A -> #B6E84A.
STYLE: clean high-contrast FIFA-Ultimate-Team feel, flat vector crest, no player photos, no real people, full-bleed background inside the frame.
```

**South Africa** — `public/cards/team-south-africa.png`

```
Design a premium collectible football trading card, 832x1248 px, portrait, PNG.
FRAME: polished gold metallic border ~28px thick, rounded corners, subtle bevel, thin near-black inner line.
ARTWORK: the national football crest/emblem of South Africa, large and crisp, centered in the upper two-thirds, on a smooth diagonal gradient from #007A4D (top-left) to #FFB612 (bottom-right) with a soft radial glow behind the crest; lower third darkens to near-black.
TOP-LEFT: circular medallion of the South Africa flag (🇿🇦) ringed in thin gold.
TOP-RIGHT: gold rounded-rectangle pill with bold white uppercase text "TEAM".
NAME: at the bottom, "SOUTH AFRICA" in large bold condensed uppercase white sans-serif, centered.
ACCENT BAR: beneath the name, a thin horizontal gradient bar #A435F0 -> #E0347A -> #FF5A3C -> #25C46A -> #B6E84A.
STYLE: clean high-contrast FIFA-Ultimate-Team feel, flat vector crest, no player photos, no real people, full-bleed background inside the frame.
```
