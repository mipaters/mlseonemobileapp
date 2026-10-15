import { STANDINGS, SCORING_LEADERS } from "../../data/standings";
import { teamById } from "../../data/teams";
import { SectionHeader } from "../ui/SectionHeader";

export function StandingsSection() {
  return (
    <section className="mt-6">
      <SectionHeader eyebrow="Standings" title="Your Teams' Standings" />
      <div className="flex gap-3 overflow-x-auto scroll-row px-4 pb-1">
        {STANDINGS.map((table) => (
          <div key={table.teamId} className="shrink-0 w-[260px] rounded-2xl border border-white/10 bg-navy-800 p-3">
            <div className="flex items-baseline justify-between gap-2">
              <h3 className="font-display text-base font-semibold uppercase tracking-tight text-white">
                {teamById(table.teamId)?.name}
              </h3>
              <span className="text-[10px] text-silver-500 uppercase tracking-wide shrink-0">
                {table.league} · {table.division}
              </span>
            </div>
            <table className="w-full mt-2 text-xs">
              <thead>
                <tr className="text-silver-500 uppercase tracking-wide text-[10px]">
                  <th className="text-left font-medium pb-1">Team</th>
                  <th className="text-right font-medium pb-1">GP</th>
                  <th className="text-right font-medium pb-1">W</th>
                  <th className="text-right font-medium pb-1">L</th>
                  <th className="text-right font-medium pb-1">PTS</th>
                </tr>
              </thead>
              <tbody>
                {table.rows.map((row) => (
                  <tr key={row.abbreviation} className={row.isUserTeam ? "text-accent-gold font-bold" : "text-silver-100"}>
                    <td className="py-0.5">{row.abbreviation}</td>
                    <td className="text-right py-0.5">{row.gamesPlayed}</td>
                    <td className="text-right py-0.5">{row.wins}</td>
                    <td className="text-right py-0.5">{row.losses}</td>
                    <td className="text-right py-0.5">{row.points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </section>
  );
}

export function ScoringLeadersSection() {
  return (
    <section className="mt-6">
      <SectionHeader eyebrow="Stats" title="Scoring Leaders" />
      <div className="flex gap-3 overflow-x-auto scroll-row px-4 pb-1">
        {SCORING_LEADERS.map((board) => (
          <div key={board.teamId} className="shrink-0 w-[260px] rounded-2xl border border-white/10 bg-navy-800 p-3">
            <h3 className="font-display text-base font-semibold uppercase tracking-tight text-white">
              {teamById(board.teamId)?.name}
            </h3>
            <p className="text-[10px] text-silver-500 uppercase tracking-wide">{board.heading}</p>
            <ol className="mt-2 space-y-2">
              {board.leaders.map((leader, i) => (
                <li key={leader.name} className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-silver-500 text-xs w-3 shrink-0">{i + 1}</span>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-white truncate">{leader.name}</p>
                      <p className="text-[10px] text-silver-500">{leader.statLine}</p>
                    </div>
                  </div>
                  <span className="text-accent-gold text-sm font-bold shrink-0">{leader.primaryStat}</span>
                </li>
              ))}
            </ol>
          </div>
        ))}
      </div>
    </section>
  );
}
