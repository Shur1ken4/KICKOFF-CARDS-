import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from "recharts";
import { withAlpha } from "../../data/teams.js";

function ChartTooltip({ active, payload, label, teams }) {
  if (!active || !payload?.length) return null;
  const get = (key) => payload.find((p) => p.dataKey === key)?.value;
  return (
    <div className="rounded-lg border border-canvas bg-paper px-3 py-2 text-xs shadow-lg">
      <div className="tnum mb-1 font-semibold text-ink">{label}'</div>
      <div className="flex flex-col gap-0.5">
        <span style={{ color: teams.home.primary }}>
          {teams.home.flag} {teams.homeName} {Math.round(get("home"))}%
        </span>
        <span className="text-graphite">Draw {Math.round(get("draw"))}%</span>
        <span style={{ color: teams.away.primary }}>
          {teams.away.flag} {teams.awayName} {Math.round(get("away"))}%
        </span>
      </div>
    </div>
  );
}

export default function OddsChart({ series = [], teams, meta, goals = [] }) {
  const homeColor = teams.home.primary;
  const awayColor = teams.away.primary;
  const drawColor = "#9CA3AF";

  const data = series.length
    ? series
    : [{ minute: 0, home: 0, draw: 0, away: 0 }];

  const teamMeta = {
    home: teams.home,
    away: teams.away,
    homeName: meta?.home,
    awayName: meta?.away,
  };

  return (
    <div className="card-light flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-canvas px-4 py-3">
        <span className="eyebrow">Win Probability</span>
        <div className="flex items-center gap-3 text-[11px]">
          <Legend color={homeColor} label={meta?.home} />
          <Legend color={drawColor} label="Draw" />
          <Legend color={awayColor} label={meta?.away} />
        </div>
      </div>
      <div className="min-h-[220px] flex-1 p-2 sm:p-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 12, bottom: 6, left: -18 }}>
            <CartesianGrid stroke="#E5E7EB" strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="minute"
              type="number"
              domain={[0, 90]}
              ticks={[0, 15, 30, 45, 60, 75, 90]}
              tick={{ fill: "#5E5D5C", fontSize: 11 }}
              stroke="#E5E7EB"
            />
            <YAxis
              domain={[0, 100]}
              ticks={[0, 25, 50, 75, 100]}
              tick={{ fill: "#5E5D5C", fontSize: 11 }}
              stroke="#E5E7EB"
              unit="%"
            />
            <Tooltip content={<ChartTooltip teams={teamMeta} />} cursor={{ stroke: "#9CA3AF" }} />

            {goals.map((g) => (
              <ReferenceLine
                key={g.id}
                x={g.minute}
                stroke={withAlpha("#FFB800", 0.6)}
                strokeDasharray="2 3"
                label={{ value: "⚽", position: "top", fontSize: 12 }}
              />
            ))}

            <Line
              type="monotone"
              dataKey="home"
              stroke={homeColor}
              strokeWidth={2.5}
              dot={false}
              isAnimationActive
              animationDuration={400}
            />
            <Line
              type="monotone"
              dataKey="draw"
              stroke={drawColor}
              strokeWidth={1.5}
              strokeDasharray="4 4"
              dot={false}
              isAnimationActive
              animationDuration={400}
            />
            <Line
              type="monotone"
              dataKey="away"
              stroke={awayColor}
              strokeWidth={2.5}
              dot={false}
              isAnimationActive
              animationDuration={400}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function Legend({ color, label }) {
  return (
    <span className="flex items-center gap-1.5 text-graphite">
      <span className="h-2 w-2 rounded-full" style={{ background: color }} />
      <span className="max-w-[70px] truncate">{label}</span>
    </span>
  );
}
