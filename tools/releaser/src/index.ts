import {
  ChangelogConfig,
  determineSemverChange,
  getGitDiff,
  parseCommits,
  loadChangelogConfig,
} from "changelogen";
import { execSync } from "child_process";
import semver from "semver";

function getLatestGitTag(): string {
  const tag = execSync("git describe --tags --abbrev=0").toString().trim();
  return tag;
}

const lastVersionTag = getLatestGitTag();
const lastVersion = lastVersionTag.substring(1);
console.log(`Last version was: ${lastVersion}`);

const config: ChangelogConfig = await loadChangelogConfig(process.cwd());

const gitCommits = parseCommits(await getGitDiff(lastVersionTag), config);

const bump = determineSemverChange(gitCommits, config);
if (!bump) throw new Error("Version bump could not be determined");

const newVersion = semver.inc(lastVersion, bump);
console.log(`New version will be: ${newVersion}`);

console.log(`Tagging and pushing…`);
execSync(`git tag v${newVersion}`);
execSync(`git push origin v${newVersion}`);
