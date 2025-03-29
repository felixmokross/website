import type { Media, Meta } from "@fxmk/payload-types";
import { getAltFromMedia } from "./media";
import { imagekitUrl } from "./imagekit";
import type { MetaDescriptor } from "react-router";

type Environment = {
  imagekitBaseUrl: string;
};

type PageMeta = {
  title?: string | null;
  image?: (string | null) | Media;
  description?: string | null;
};

export function getPageMetaDescriptors(
  canonicalUrl: string | undefined,
  pageMeta: PageMeta | undefined,
  siteMeta: Meta,
  environment: Environment,
): MetaDescriptor[] {
  const title = pageMeta?.title ?? "";
  const description = pageMeta?.description ?? "";
  return [
    { tagName: "link", rel: "canonical", href: canonicalUrl },
    { title },
    { name: "description", content: description },
    { name: "og:title", content: title },
    { name: "og:description", content: description },
    ...(siteMeta.locale
      ? [{ name: "og:locale", content: siteMeta.locale }]
      : []),
    { name: "og:type", content: "website" },
    ...(siteMeta.siteName
      ? [{ name: "og:site_name", content: siteMeta.siteName }]
      : []),
    {
      name: "og:url",
      content: canonicalUrl,
    },
    ...getOpenGraphImageMeta(pageMeta, environment),
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
    ...getTwitterCardImageMeta(pageMeta, environment),
  ];
}

function getTwitterCardImageMeta(
  meta: PageMeta | undefined,
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
  meta: PageMeta | undefined,
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
  meta: PageMeta | undefined,
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
