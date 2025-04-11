import { execSync } from "child_process";
import { program } from "commander";
import { Octokit } from "@octokit/rest";
import {
  getConfig,
  getLastReleaseVersionTag,
  getReleaseNotes,
} from "src/common";

program
  .command("publish")
  .option("-d, --draft", "Create a draft release")
  .argument("<newVersion>")
  .action(async (newVersion, options) => {
    const lastReleaseVersionTag = getLastReleaseVersionTag();
    const newVersionTag = `v${newVersion}`;

    console.log(`Creating and pushing tag…`);
    execSync(`git tag ${newVersionTag}`);
    execSync(`git push origin ${newVersionTag}`);

    const config = await getConfig(lastReleaseVersionTag);

    const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

    const [owner, repo] = process.env.GITHUB_REPOSITORY!.split("/");

    console.log(`Creating release…`);
    const createReleaseResponse = await octokit.repos.createRelease({
      owner,
      repo,
      tag_name: newVersionTag,
      name: newVersionTag,
      body: await getReleaseNotes(lastReleaseVersionTag, config),
      draft: !!options.draft,
      prerelease: false,
    });
    console.log("Release created:", createReleaseResponse.data.html_url);
  });
