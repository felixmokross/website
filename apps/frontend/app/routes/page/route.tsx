import { useLoaderData, type LoaderFunctionArgs } from "react-router";
import { About } from "./about";
import { Archive } from "./archive";
import { tryGetPage } from "~/utils/cms-data.server";
import { Columns } from "./columns";
import { Photos } from "./photos";
import { getCanonicalRequestUrl, getRequestUrl, toUrl } from "~/utils/routing";
import { handleIncomingRequest } from "~/utils/routing.server";
import { Hero } from "./hero";
import { Projects } from "./projects";

export function meta() {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export async function loader({ request }: LoaderFunctionArgs) {
  const { pageUrl } = await handleIncomingRequest(request);

  const requestUrl = getRequestUrl(request);
  const content = await tryGetPage(toUrl(pageUrl).pathname);
  if (!content) {
    throw new Response(null, { status: 404, statusText: "Not Found" });
  }
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
