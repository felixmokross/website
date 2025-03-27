import { program } from "commander";
import { getConfig, getLastVersionTag, getReleaseNotes } from "src/common";

program.command("get-release-notes").action(async () => {
  const lastVersionTag = getLastVersionTag();

  const config = await getConfig(lastVersionTag);

  console.info(await getReleaseNotes(lastVersionTag, config));
});
