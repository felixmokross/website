import {
  ChangelogConfig,
  getGitDiff,
  loadChangelogConfig,
  parseCommits,
} from "changelogen";
import { execSync } from "child_process";

export async function getConfig(lastVersionTag: string) {
  return await loadChangelogConfig(process.cwd(), {
    from: lastVersionTag,
  });
}

export function getLastVersionTag(): string {
  const tag = execSync("git describe --tags --abbrev=0").toString().trim();
  return tag;
}

export async function getGitCommits(
  lastVersionTag: string,
  config: ChangelogConfig,
) {
  return parseCommits(await getGitDiff(lastVersionTag), config);
}
