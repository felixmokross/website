import type { Media } from "@fxmk/shared";
import { useEnvironment } from "../utils/environment";
import React, { useMemo } from "react";
import { imagekitUrl } from "~/utils/imagekit";

type ImageProps = {
  media: Media | string;
  preferredSize?: keyof NonNullable<Media["sizes"]>;
} & Omit<
  React.DetailedHTMLProps<
    React.ImgHTMLAttributes<HTMLImageElement>,
    HTMLImageElement
  >,
  "alt" | "src"
>;

export function MediaImage({
  media,
  preferredSize = "large",
  ...props
}: ImageProps) {
  if (typeof media !== "object") return null;

  const src = useImageSrc(
    media.sizes &&
      media.sizes[preferredSize] &&
      media.sizes[preferredSize].filename
      ? media.sizes[preferredSize].filename
      : media.filename,
  );
  if (!src) return null;

  return <img src={src} alt={media.alt ?? ""} {...props} />;
}

function useImageSrc(filename: string | undefined | null) {
  const { imagekitBaseUrl } = useEnvironment();
  const url = useMemo(
    () => (filename ? imagekitUrl(imagekitBaseUrl, filename) : null),
    [filename, imagekitBaseUrl],
  );

  return url;
}
