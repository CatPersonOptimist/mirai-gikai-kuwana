interface YearGroupableSession {
  id: string;
  slug: string | null;
  start_date: string;
}

export interface SessionYearGroup<T> {
  year: number;
  sessions: T[];
}

/**
 * 会期を開始年ごとにまとめる（新しい年が先、年の中は開始日が新しい順）。
 * 一覧ページへのリンクを作れない（slug が無い）会期と、excludeIds の会期は除く。
 */
export function groupSessionsByYear<T extends YearGroupableSession>(
  sessions: readonly T[],
  excludeIds: readonly string[] = []
): SessionYearGroup<T>[] {
  const excluded = new Set(excludeIds);
  const groups = new Map<number, T[]>();

  const sorted = sessions
    .filter((session) => session.slug && !excluded.has(session.id))
    .sort((a, b) => (a.start_date < b.start_date ? 1 : -1));

  for (const session of sorted) {
    const year = Number(session.start_date.slice(0, 4));
    if (!Number.isFinite(year)) continue;
    const list = groups.get(year) ?? [];
    list.push(session);
    groups.set(year, list);
  }

  return [...groups.entries()]
    .sort(([a], [b]) => b - a)
    .map(([year, list]) => ({ year, sessions: list }));
}

/** 西暦の年を「2025年（令和7年）」の形にする。令和より前は西暦のみ。 */
export function formatYearWithEra(year: number): string {
  if (year < 2019) return `${year}年`;
  const reiwa = year - 2018;
  return `${year}年（令和${reiwa === 1 ? "元" : reiwa}年）`;
}
