import { determineSemverChange } from "changelogen";
import { execSync } from "child_process";
import { program } from "commander";
import semver from "semver";
import {
  filterConventionalCommits,
  getConfig,
  getRawCommits,
  getLastVersionTag,
} from "src/common";

program.command("get-version").action(async () => {
  const lastVersionTag = getLastVersionTag();
  const config = await getConfig(lastVersionTag);
  const rawCommits = await getRawCommits(lastVersionTag);

  const lastVersion = lastVersionTag.substring(1);

  let newVersion = lastVersion;

  const hasUnreleasedChanges = rawCommits.length > 0;
  if (hasUnreleasedChanges) {
    // At least the patch version will increase if there are any new commits
    const conventionalCommits = filterConventionalCommits(rawCommits, config);
    const bumpType =
      determineSemverChange(conventionalCommits, config) ?? "patch";
    const bumpedVersion = semver.inc(lastVersion, bumpType);
    if (!bumpedVersion) {
      throw new Error("New version could not be determined");
    }

    newVersion = bumpedVersion;

    const githubHeadRef = process.env.GITHUB_HEAD_REF;
    const branchName = execSync(`git rev-parse --abbrev-ref HEAD`)
      .toString()
      .trim();
    const sanitizedBranchName = (githubHeadRef || branchName)
      .replace("/", "-")
      .replace("_", "-")
      .replace(/[^a-zA-Z0-9.-]/g, "");

    newVersion += `-${sanitizedBranchName}.${rawCommits.length}`;
  }

  const sha = execSync(`git rev-parse --short HEAD`).toString().trim();

  console.log(
    JSON.stringify(
      {
        version: newVersion,
        versionWithSha: `${newVersion}-${sha}`,
      },
      null,
      2,
    ),
  );
});
