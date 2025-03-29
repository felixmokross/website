import { getMeta } from "~/utils/cms-data.server";
import { getEnvironment } from "~/utils/environment.server";
import type { Route } from "./+types/route";
import { imagekitUrl } from "~/utils/imagekit";

export async function loader({ request }: Route.LoaderArgs) {
  const meta = await getMeta();
  if (!meta.favicon || typeof meta.favicon !== "object") {
    throw new Error("Invalid favicon");
  }

  const environment = getEnvironment(request);
  return Response.json({
    name: meta.siteName,
    short_name: meta.siteName,
    icons: [
      {
        src: imagekitUrl(environment.imagekitBaseUrl, meta.favicon.filename!, [
          { format: "png", width: "192", height: "192" },
        ]),
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: imagekitUrl(environment.imagekitBaseUrl, meta.favicon.filename!, [
          { format: "png", width: "512", height: "512" },
        ]),
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    theme_color: meta.themeColor,
    background_color: meta.backgroundColor,
    display: "browser",
  });
}
