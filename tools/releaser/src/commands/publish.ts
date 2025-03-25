import { execSync } from "child_process";
import { program } from "commander";
import { Octokit } from "@octokit/rest";
import { generateMarkDown } from "changelogen";
import { getConfig, getGitCommits, getLastVersionTag } from "src/common";

program
  .command("publish")
  .argument("<newVersion>")
  .action(async (newVersion) => {
    const lastVersionTag = getLastVersionTag();
    const newVersionTag = `v${newVersion}`;

    if (lastVersionTag === newVersionTag) {
      console.info(`Tag ${newVersionTag} already exists.`);
      return;
    }

    console.log(`Creating and pushing tag…`);
    execSync(`git tag ${newVersionTag}`);
    execSync(`git push origin ${newVersionTag}`);

    const config = await getConfig(lastVersionTag);
    const gitCommits = await getGitCommits(lastVersionTag, config);

    const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

    console.log(`Creating release…`);
    const createReleaseResponse = await octokit.repos.createRelease({
      owner: "felixmokross",
      repo: "website",
      tag_name: newVersionTag,
      name: newVersionTag,
      body: await generateMarkDown(gitCommits, config),
      draft: false,
      prerelease: false,
    });
    console.log("Release created:", createReleaseResponse.data.html_url);
  });
