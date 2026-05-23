import { program } from "commander";
import {
  getConfig,
  getLastReleaseVersionTag,
  getReleaseNotes,
} from "../common";

program.command("get-release-notes").action(async () => {
  const lastReleaseVersionTag = getLastReleaseVersionTag();

  const config = await getConfig(lastReleaseVersionTag);

  console.info(await getReleaseNotes(lastReleaseVersionTag, config));
});
