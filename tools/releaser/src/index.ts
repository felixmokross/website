import { program } from "commander";
import "./commands";

program.name("releaser");

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
