import { getVersion } from "~/utils/version.server";

export async function loader() {
  return Response.json({ version: getVersion() });
}
