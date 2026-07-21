import type { ContributionDay } from "@/lib/github";

const levelClasses: Record<ContributionDay["level"], string> = {
  0: "bg-line/60",
  1: "bg-accent/25",
  2: "bg-accent/55",
  3: "bg-accent/85",
  4: "bg-lime",
};

const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

// GitHub-style: only the Mon/Wed/Fri rows get a label, to keep the axis quiet.
const dayLabels = ["", "Mon", "", "Wed", "", "Fri", ""];

/** UTC day-of-week (0 = Sunday) - avoids off-by-one from local-timezone parsing. */
function utcDayOfWeek(date: string) {
  const [y, m, d] = date.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).getUTCDay();
}

/** GitHub-style contribution calendar: 7 rows (Sun-Sat), columns flow by week. */
export function HeatmapGrid({ days }: { days: ContributionDay[] }) {
  if (days.length === 0) return null;

  const leadingPad = utcDayOfWeek(days[0].date);
  const cells: (ContributionDay | null)[] = [...Array(leadingPad).fill(null), ...days];
  const weekCount = Math.ceil(cells.length / 7);

  // One label per week-column: the month name, shown only where it changes.
  let lastMonth = -1;
  const monthLabels: (string | null)[] = [];
  for (let w = 0; w < weekCount; w++) {
    const firstDay = cells
      .slice(w * 7, w * 7 + 7)
      .find((d): d is ContributionDay => d !== null);
    if (!firstDay) {
      monthLabels.push(null);
      continue;
    }
    const month = Number(firstDay.date.slice(5, 7)) - 1;
    monthLabels.push(month !== lastMonth ? monthNames[month] : null);
    lastMonth = month;
  }

  return (
    <div className="overflow-x-auto pb-1">
      <div className="flex w-max gap-[6px]">
        <div className="grid shrink-0 gap-[3px]" style={{ gridTemplateRows: "repeat(7, 11px)" }}>
          {dayLabels.map((label, i) => (
            <span
              key={i}
              className="flex h-[11px] items-center font-mono text-[9px] text-faint uppercase"
            >
              {label}
            </span>
          ))}
        </div>

        <div>
          <div className="grid gap-[3px]" style={{ gridAutoFlow: "column", gridAutoColumns: "11px" }}>
            {monthLabels.map((label, i) => (
              <span key={i} className="font-mono text-[9px] text-faint uppercase">
                {label ?? ""}
              </span>
            ))}
          </div>

          <div
            className="mt-[3px] grid gap-[3px]"
            style={{
              gridTemplateRows: "repeat(7, 11px)",
              gridAutoFlow: "column",
              gridAutoColumns: "11px",
            }}
          >
            {cells.map((day, i) =>
              day ? (
                <span
                  key={day.date}
                  title={`${day.count} contribution${day.count === 1 ? "" : "s"} - ${day.date}`}
                  className={`size-[11px] border border-foreground/10 ${levelClasses[day.level]}`}
                />
              ) : (
                <span key={`pad-${i}`} aria-hidden="true" className="size-[11px]" />
              ),
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
