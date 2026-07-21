export type ContributionDay = {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
};

type ContributionsResponse = {
  total: Record<string, number>;
  contributions: ContributionDay[];
};

/**
 * Last-year contribution calendar via jogruber's public GitHub contributions
 * API - no auth token needed, unlike GitHub's own GraphQL API.
 */
export async function getContributions(username: string) {
  try {
    const res = await fetch(`https://github-contributions-api.jogruber.de/v4/${username}?y=last`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    return (await res.json()) as ContributionsResponse;
  } catch {
    return null;
  }
}
