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
import type { Route } from "./+types/route";
import type { SerializeFromLoader } from "~/utils/types";
import { loader as rootLoader } from "~/root";
import { getAltFromMedia } from "~/utils/media";
import { imagekitUrl } from "~/utils/imagekit";

export function meta({ data, matches }: Route.MetaArgs) {
  const { content } = data;

  const rootLoaderData = matches.find((m) => m?.id === "root")
    ?.data as SerializeFromLoader<typeof rootLoader>;
  if (!rootLoaderData) throw new Error("No root loader data");

  const title = content.meta?.title ?? "";
  const description = content.meta?.description ?? "";
  return [
    {
      tagName: "link",
      rel: "canonical",
      href: data?.canonicalUrl,
    },
    { title },
    { name: "description", content: description },
    {
      name: "og:title",
      content: title,
    },
    {
      name: "og:description",
      content: description,
    },
    {
      name: "og:locale",
      content: "en",
    },
    {
      name: "og:type",
      content: "website",
    },
    {
      name: "og:site_name",
      content: "fxmk.dev",
    },
    {
      name: "og:url",
      content: data.canonicalUrl,
    },
    ...getOpenGraphImageMeta(data, rootLoaderData),
    {
      name: "twitter:card",
      content: "summary_large_image",
    },
    {
      name: "twitter:title",
      content: title,
    },
    {
      name: "twitter:description",
      content: description,
    },
    ...getTwitterCardImageMeta(data, rootLoaderData),
  ];
}

function getTwitterCardImageMeta(
  data: SerializeFromLoader<typeof loader>,
  rootLoaderData: SerializeFromLoader<typeof rootLoader>,
): { name: string; content: string }[] {
  const image = data.content.meta?.image;
  if (!image) {
    return [];
  }

  if (typeof image !== "object") {
    throw new Error("Invalid image");
  }

  return [
    {
      name: "twitter:image",
      content: getSocialImageUrl(data, rootLoaderData, 2400, 1200),
    },
    {
      name: "twitter:image:alt",
      content: getAltFromMedia(image) ?? "",
    },
  ];
}

function getOpenGraphImageMeta(
  data: SerializeFromLoader<typeof loader>,
  rootLoaderData: SerializeFromLoader<typeof rootLoader>,
): { name: string; content: string }[] {
  const image = data.content.meta?.image;
  if (!image) {
    return [];
  }

  if (typeof image !== "object") {
    throw new Error("Invalid image");
  }

  const width = 1200;
  const height = 630;

  return [
    {
      name: "og:image",
      content: getSocialImageUrl(data, rootLoaderData, width, height),
    },
    {
      name: "og:image:alt",
      content: getAltFromMedia(image) ?? "",
    },
    { name: "og:image:type", content: image.mimeType ?? "" },
    { name: "og:image:width", content: width.toString() },
    { name: "og:image:height", content: height.toString() },
  ];
}

function getSocialImageUrl(
  data: SerializeFromLoader<typeof loader>,
  rootLoaderData: SerializeFromLoader<typeof rootLoader>,
  width: number,
  height: number,
) {
  const image = data.content.meta?.image;
  if (typeof image !== "object") {
    throw new Error("Invalid image");
  }

  if (!image?.filename) return "";

  return imagekitUrl(
    rootLoaderData.environment.imagekitBaseUrl,
    image.filename,
    [
      {
        width: width.toString(),
        height: height.toString(),
      },
    ],
  );
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
