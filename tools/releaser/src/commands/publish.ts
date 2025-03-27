import { execSync } from "child_process";
import { program } from "commander";
import { Octokit } from "@octokit/rest";
import { getConfig, getLastVersionTag, getReleaseNotes } from "src/common";

program
  .command("publish")
  .option("-d, --draft", "Create a draft release")
  .argument("<newVersion>")
  .action(async (newVersion, options) => {
    const lastVersionTag = getLastVersionTag();
    const newVersionTag = `v${newVersion}`;

    console.log(`Creating and pushing tag…`);
    execSync(`git tag ${newVersionTag}`);
    execSync(`git push origin ${newVersionTag}`);

    const config = await getConfig(lastVersionTag);

    const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

    console.log(`Creating release…`);
    const createReleaseResponse = await octokit.repos.createRelease({
      owner: "felixmokross",
      repo: "website",
      tag_name: newVersionTag,
      name: newVersionTag,
      body: await getReleaseNotes(lastVersionTag, config),
      draft: !!options.draft,
      prerelease: false,
    });
    console.log("Release created:", createReleaseResponse.data.html_url);
  });
