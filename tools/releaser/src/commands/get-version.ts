import {
  determineSemverChange,
  getGitDiff,
  loadChangelogConfig,
  parseCommits,
} from "changelogen";
import { execSync } from "child_process";
import { program } from "commander";
import semver from "semver";

program
  .command("get-version")
  .option("-r, --release", "Create a release version")
  .action(async (options) => {
    function getLatestGitTag(): string {
      const tag = execSync("git describe --tags --abbrev=0").toString().trim();
      return tag;
    }

    const lastVersionTag = getLatestGitTag();
    const lastVersion = lastVersionTag.substring(1);

    const config = await loadChangelogConfig(process.cwd(), {
      from: lastVersionTag,
    });

    const gitCommits = parseCommits(await getGitDiff(lastVersionTag), config);

    // At least the patch version will increase
    const bumpType = determineSemverChange(gitCommits, config) ?? "patch";

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
