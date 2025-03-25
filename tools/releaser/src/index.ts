import {
  determineSemverChange,
  getGitDiff,
  parseCommits,
  loadChangelogConfig,
  generateMarkDown,
} from "changelogen";
import { execSync } from "child_process";
import semver from "semver";
import { Octokit } from "@octokit/rest";

function getLatestGitTag(): string {
  const tag = execSync("git describe --tags --abbrev=0").toString().trim();
  return tag;
}

const lastVersionTag = getLatestGitTag();
const lastVersion = lastVersionTag.substring(1);
console.log(`Last version was: ${lastVersion}`);

const config = await loadChangelogConfig(process.cwd(), {
  from: lastVersionTag,
});

const gitCommits = parseCommits(await getGitDiff(lastVersionTag), config);

const bump = determineSemverChange(gitCommits, config);
if (!bump) throw new Error("Version bump could not be determined");

const newVersion = semver.inc(lastVersion, bump);
if (!newVersion) throw new Error("New version could not be determined");

const newVersionTag = `v${newVersion}`;
config.to = newVersionTag;

console.log(`Version: ${newVersion}`);
console.log(`Tagging and pushing…`);

execSync(`git tag ${newVersionTag}`);
execSync(`git push origin ${newVersionTag}`);

console.log(`Creating release…`);
const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
const release = await octokit.repos.createRelease({
  owner: "felixmokross",
  repo: "website",
  tag_name: newVersionTag,
  name: newVersionTag,
  body: await generateMarkDown(gitCommits, config),
  draft: false,
  prerelease: false,
});

console.log("Release created:", release.data.html_url);
