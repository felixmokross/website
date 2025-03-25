import { execSync } from "child_process";
import { program } from "commander";
import { Octokit } from "@octokit/rest";
import { generateMarkDown } from "changelogen";
import { getConfig, getGitCommits, getLastVersionTag } from "src/common";

program
  .command("publish")
  .argument("<newVersion>")
  .action(async (newVersion) => {
    console.log(`Creating tag and pushing…`);
    const newVersionTag = `v${newVersion}`;
    execSync(`git tag ${newVersionTag}`);
    execSync(`git push origin ${newVersionTag}`);

    const lastVersionTag = getLastVersionTag();
    const config = await getConfig(lastVersionTag);
    const gitCommits = await getGitCommits(lastVersionTag, config);

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
  });
