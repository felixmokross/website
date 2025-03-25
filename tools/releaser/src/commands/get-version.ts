import {
  determineSemverChange,
  getGitDiff,
  loadChangelogConfig,
  parseCommits,
} from "changelogen";
import { execSync } from "child_process";
import { program } from "commander";
import semver from "semver";
import { getConfig, getGitCommits, getLastVersionTag } from "src/common";

program
  .command("get-version")
  .option("-r, --release", "Create a release version")
  .action(async (options) => {
    const lastVersionTag = getLastVersionTag();
    const config = await getConfig(lastVersionTag);
    const gitCommits = await getGitCommits(lastVersionTag, config);

    // At least the patch version will increase
    const bumpType = determineSemverChange(gitCommits, config) ?? "patch";

    const lastVersion = lastVersionTag.substring(1);
    const newVersion = semver.inc(lastVersion, bumpType);
    if (!newVersion) throw new Error("New version could not be determined");

    const newVersionTag = `v${newVersion}`;
    config.to = newVersionTag;

    if (options.release) {
      console.log(newVersion);
      return;
    }

    const commitsSinceLastVersion = execSync(
      `git rev-list --count ${lastVersionTag}..HEAD`,
    )
      .toString()
      .trim();

    const githubHeadRef = process.env.GITHUB_HEAD_REF;
    const branchName =
      githubHeadRef ||
      execSync(`git rev-parse --abbrev-ref HEAD`).toString().trim();
    const sanitizedBranchName = branchName
      .replace("/", "-")
      .replace("_", "-")
      .replace(/[^a-zA-Z0-9.-]/g, "");

    console.log(
      `${newVersion}-${sanitizedBranchName}.${commitsSinceLastVersion}`,
    );
  });
