import {
  determineSemverChange,
  getGitDiff,
  parseCommits,
  loadChangelogConfig,
} from "changelogen";
import { execSync } from "child_process";
import semver from "semver";
import { program } from "commander";

program
  .name("releaser")
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

    const bump = determineSemverChange(gitCommits, config);
    if (!bump) throw new Error("Version bump could not be determined");

    const newVersion = semver.inc(lastVersion, bump);
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

    const sanitizedBranchName = execSync(`git rev-parse --abbrev-ref HEAD`)
      .toString()
      .trim()
      .replace("/", "-")
      .replace("_", "-")
      .replace(/[^a-zA-Z0-9.-]/g, "");

    console.log(
      `${newVersion}-${sanitizedBranchName}.${commitsSinceLastVersion}`,
    );
  });

program.parse();

// console.log(`Version: ${newVersion}`);
// console.log(`Tagging and pushing…`);

// execSync(`git tag ${newVersionTag}`);
// execSync(`git push origin ${newVersionTag}`);

// console.log(`Creating release…`);
// const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
// const release = await octokit.repos.createRelease({
//   owner: "felixmokross",
//   repo: "website",
//   tag_name: newVersionTag,
//   name: newVersionTag,
//   body: await generateMarkDown(gitCommits, config),
//   draft: false,
//   prerelease: false,
// });

// console.log("Release created:", release.data.html_url);
