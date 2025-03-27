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

program
  .command("get-version")
  .option("-r, --release", "Create a release version")
  .action(async (options) => {
    const lastVersionTag = getLastVersionTag();
    const config = await getConfig(lastVersionTag);
    const rawCommits = await getRawCommits(lastVersionTag);

    const lastVersion = lastVersionTag.substring(1);

    let newVersion = lastVersion;

    const hasUnreleasedChanges = rawCommits.length > 0;

    const isReleaseRequested =
      rawCommits[0].message.includes("!release") || !!options.release;

    const isNewRelease = hasUnreleasedChanges && isReleaseRequested;
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

      if (!isReleaseRequested) {
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
    }

    const sha = execSync(`git rev-parse --short HEAD`).toString().trim();

    console.log(
      JSON.stringify(
        {
          version: newVersion,
          versionWithSha: `${newVersion}-${sha}`,
          isNewRelease,
        },
        null,
        2,
      ),
    );
  });
