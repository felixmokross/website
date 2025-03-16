import type { Media } from "@fxmk/payload-types";
import { getAltFromMedia } from "./media";
import { imagekitUrl } from "./imagekit";

type Environment = {
  imagekitBaseUrl: string;
};

type Meta = {
  title?: string | null;
  image?: (string | null) | Media;
  description?: string | null;
};

export function getMeta(
  canonicalUrl: string | undefined,
  meta: Meta | undefined,
  environment: Environment,
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
    ...getOpenGraphImageMeta(meta, environment),
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
    ...getTwitterCardImageMeta(meta, environment),
  ];
}

function getTwitterCardImageMeta(
  meta: Meta | undefined,
  environment: Environment,
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
      content: getSocialImageUrl(meta, 2400, 1200, environment),
    },
    {
      name: "twitter:image:alt",
      content: getAltFromMedia(image) ?? "",
    },
  ];
}

function getOpenGraphImageMeta(
  meta: Meta | undefined,
  environment: Environment,
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
      content: getSocialImageUrl(meta, width, height, environment),
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

export function getSocialImageUrl(
  meta: Meta | undefined,
  width: number,
  height: number,
  environment: Environment,
) {
  const image = meta?.image;
  if (typeof image !== "object") {
    throw new Error("Invalid image");
  }

  if (!image?.filename) return "";

  return imagekitUrl(environment.imagekitBaseUrl, image.filename, [
    {
      width: width.toString(),
      height: height.toString(),
    },
  ]);
}
