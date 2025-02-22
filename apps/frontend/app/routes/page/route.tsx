import { useLoaderData, type LoaderFunctionArgs } from "react-router";
import { About } from "./about";
import { Archive } from "./archive";
import { Columns } from "./columns";
import { Photos } from "./photos";
import { getCanonicalRequestUrl, getRequestUrl, toUrl } from "~/utils/routing";
import { handleIncomingRequest, handlePathname } from "~/utils/routing.server";
import { Hero } from "./hero";
import { Projects } from "./projects";
import type { Route } from "./+types/route";
import type { SerializeFromLoader } from "~/utils/types";
import { type loader as rootLoader } from "~/root";
import { getMeta } from "~/utils/meta";

export function meta({ data, matches }: Route.MetaArgs) {
  const { content, canonicalUrl } = data;

  const rootLoaderData = matches.find((m) => m?.id === "root")
    ?.data as SerializeFromLoader<typeof rootLoader>;
  if (!rootLoaderData) throw new Error("No root loader data");

  return getMeta(canonicalUrl, content.meta, rootLoaderData.environment);
}

export async function loader({ request }: LoaderFunctionArgs) {
  const { pageUrl } = await handleIncomingRequest(request);

  const requestUrl = getRequestUrl(request);
  const content = await handlePathname(toUrl(pageUrl).pathname);

  const dataPath = `pages/${content.id}`;

  return {
    origin: requestUrl.origin,
    canonicalUrl: getCanonicalRequestUrl(request).href,
    pageUrl,
    dataPath,
    content,
  };
}

export default function Route() {
  const { content } = useLoaderData<typeof loader>();
  return (
    <>
      {content.hero && <Hero {...content.hero} />}
      {content.layout?.map((block) => {
        switch (block.blockType) {
          case "photos":
            return <Photos key={block.id} {...block} />;
          case "archive":
            return <Archive key={block.id} {...block} size="full" />;
          case "columns":
            return <Columns key={block.id} {...block} />;
          case "about":
            return <About key={block.id} {...block} />;
          case "projects":
            return <Projects key={block.id} {...block} />;
          default:
            console.warn(`Unknown block type: ${block.blockType}`);
            return null;
        }
      })}
    </>
  );
}
