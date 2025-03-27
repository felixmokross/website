import { determineSemverChange } from "changelogen";
import { execSync } from "child_process";
import { program } from "commander";
import semver from "semver";
import { getConfig, getGitCommits, getLastVersionTag } from "src/common";

program.command("get-version").action(async () => {
  const branchName = execSync(`git rev-parse --abbrev-ref HEAD`)
    .toString()
    .trim();

  const lastVersionTag = getLastVersionTag();
  const config = await getConfig(lastVersionTag);
  const gitCommits = await getGitCommits(lastVersionTag, config);

  const lastVersion = lastVersionTag.substring(1);

  let newVersion = lastVersion;

  const sha = execSync(`git rev-parse --short HEAD`).toString().trim();

  const hasUnreleasedChanges = gitCommits.length > 0;
  if (hasUnreleasedChanges) {
    // At least the patch version will increase if there are any new commits
    const bumpType = determineSemverChange(gitCommits, config) ?? "patch";
    const bumpedVersion = semver.inc(lastVersion, bumpType);
    if (!bumpedVersion) {
      throw new Error("New version could not be determined");
    }

    newVersion = bumpedVersion;

    const commitsSinceLastVersion = execSync(
      `git rev-list --count ${lastVersionTag}..HEAD`,
    )
      .toString()
      .trim();

    const githubHeadRef = process.env.GITHUB_HEAD_REF;
    const sanitizedBranchName = (githubHeadRef || branchName)
      .replace("/", "-")
      .replace("_", "-")
      .replace(/[^a-zA-Z0-9.-]/g, "");

    newVersion += `-${sanitizedBranchName}.${commitsSinceLastVersion}`;
  }

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
