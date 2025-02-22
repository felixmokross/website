import type { Media } from "@fxmk/shared";
import type { SerializeFromLoader } from "./types";
import { type loader as rootLoader } from "~/root";
import { getAltFromMedia } from "./media";
import { imagekitUrl } from "./imagekit";

type Meta = {
  title?: string | null;
  image?: (string | null) | Media;
  description?: string | null;
};

export function getMeta(
  canonicalUrl: string | undefined,
  meta: Meta | undefined,
  rootLoaderData: SerializeFromLoader<typeof rootLoader>,
) {
  const title = meta?.title ?? "";
  const description = meta?.description ?? "";
  return [
    {
      tagName: "link",
      rel: "canonical",
      href: canonicalUrl,
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
      content: canonicalUrl,
    },
    ...getOpenGraphImageMeta(meta, rootLoaderData),
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
    ...getTwitterCardImageMeta(meta, rootLoaderData),
  ];
}

function getTwitterCardImageMeta(
  meta: Meta | undefined,
  rootLoaderData: SerializeFromLoader<typeof rootLoader>,
): { name: string; content: string }[] {
  const image = meta?.image;
  if (!image) {
    return [];
  }

  if (typeof image !== "object") {
    throw new Error("Invalid image");
  }

  return [
    {
      name: "twitter:image",
      content: getSocialImageUrl(meta, rootLoaderData, 2400, 1200),
    },
    {
      name: "twitter:image:alt",
      content: getAltFromMedia(image) ?? "",
    },
  ];
}

function getOpenGraphImageMeta(
  meta: Meta | undefined,
  rootLoaderData: SerializeFromLoader<typeof rootLoader>,
): { name: string; content: string }[] {
  const image = meta?.image;
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
      content: getSocialImageUrl(meta, rootLoaderData, width, height),
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
  meta: Meta | undefined,
  rootLoaderData: SerializeFromLoader<typeof rootLoader>,
  width: number,
  height: number,
) {
  const image = meta?.image;
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
