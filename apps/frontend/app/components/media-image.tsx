import type { Media } from "@fxmk/shared";
import { useEnvironment } from "../utils/environment";
import ImageKit from "imagekit-javascript";
import React, { useMemo } from "react";

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
    () =>
      filename
        ? new ImageKit({
            urlEndpoint: imagekitBaseUrl,
          }).url({ path: filename })
        : null,
    [filename, imagekitBaseUrl],
  );

  return url;
}
