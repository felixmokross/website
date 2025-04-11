import {
  determineSemverChange,
  RawGitCommit,
  ResolvedChangelogConfig,
} from "changelogen";
import { execSync } from "child_process";
import { program } from "commander";
import semver from "semver";
import {
  filterConventionalCommits,
  getConfig,
  getRawCommits,
  getLastReleaseVersionTag,
} from "src/common";

program
  .command("get-version")
  .option("-r, --release", "Create a release version")
  .action(async (options) => {
    const lastReleaseVersionTag = getLastReleaseVersionTag();
    const config = await getConfig(lastReleaseVersionTag);
    const commitsSinceLastVersion = await getRawCommits(lastReleaseVersionTag);

    const lastReleaseVersion = getReleaseVersionFromGitTag(
      lastReleaseVersionTag,
    );

    const hasUnreleasedChanges = commitsSinceLastVersion.length > 0;
    const isReleaseRequested =
      hasReleaseKeyword(commitsSinceLastVersion) || !!options.release;

    const [newReleaseVersion, prereleaseTag] = getNewVersion(
      hasUnreleasedChanges,
      isReleaseRequested,
      commitsSinceLastVersion,
      lastReleaseVersion,
      config,
    );

    const version = `${newReleaseVersion}${prereleaseTag ? `-${prereleaseTag}` : ""}`;
    const sha = getHeadCommitSha();

    console.log(
      JSON.stringify(
        {
          version,
          versionWithSha: `${version}-${sha}`,
          isRelease: !prereleaseTag,
          isNewRelease: hasUnreleasedChanges && isReleaseRequested,
          releaseVersion: newReleaseVersion,
          prereleaseTag,
          sha,
        },
        null,
        2,
      ),
    );
  });

function getReleaseVersionFromGitTag(tag: string) {
  return tag.substring(1);
}

function getHeadCommitSha() {
  return execSync(`git rev-parse --short HEAD`).toString().trim();
}

function hasReleaseKeyword(rawCommits: RawGitCommit[]) {
  return rawCommits.some((c) => c.body.includes("!release"));
}

function getNewVersion(
  hasUnreleasedChanges: boolean,
  isReleaseRequested: boolean,
  rawCommits: RawGitCommit[],
  lastReleaseVersion: string,
  config: ResolvedChangelogConfig,
) {
  if (!hasUnreleasedChanges) return [lastReleaseVersion, null];

  const newReleaseVersion = determineNewReleaseVersion(
    rawCommits,
    lastReleaseVersion,
    config,
  );
  if (isReleaseRequested) return [newReleaseVersion, null];

  const githubHeadRef = process.env.GITHUB_HEAD_REF;
  const branchName = execSync(`git rev-parse --abbrev-ref HEAD`)
    .toString()
    .trim();
  const sanitizedBranchName = (githubHeadRef || branchName)
    .replace("/", "-")
    .replace("_", "-")
    .replace(/[^a-zA-Z0-9.-]/g, "");

  return [newReleaseVersion, `${sanitizedBranchName}.${rawCommits.length}`];
}

function determineNewReleaseVersion(
  rawCommits: RawGitCommit[],
  lastVersion: string,
  config: ResolvedChangelogConfig,
) {
  const conventionalCommits = filterConventionalCommits(rawCommits, config);

  // At least the patch version will increase if there are any new commits
  const bumpType =
    determineSemverChange(conventionalCommits, config) ?? "patch";
  const bumpedVersion = semver.inc(lastVersion, bumpType);
  if (!bumpedVersion) {
    throw new Error("New version could not be determined");
  }

  return bumpedVersion;
}
