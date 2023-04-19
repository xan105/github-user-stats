declare function relativeTime(timestamp: number, locales?: string): string;
declare function queryGithub(path: string, decode?: boolean): Promise<unknown>;
export function getUserStats(username: string): Promise<{
  repos: number,
  gists: number,
  followers: number,
  following: number,
  stars: number,
  forks: number
}>;