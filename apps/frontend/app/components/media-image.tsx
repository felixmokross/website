import { mediaImageSizes } from "@fxmk/shared";
import { type Media } from "@fxmk/payload-types";
import { useEnvironment } from "../utils/environment";
import { useMemo } from "react";
import { imagekitUrl } from "~/utils/imagekit";

type ImageProps = {
  media: Media | string;
  preferredSize: ImageSize;
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

  const imageMeta = selectImageFromMedia(media, preferredSize);

  const src = useImageSrc(imageMeta);
  if (!src) return null;

  return (
    <img
      src={src}
      alt={media.alt ?? undefined}
      width={imageMeta.width ?? undefined}
      height={imageMeta.height ?? undefined}
      {...props}
    />
  );
}

function useImageSrc(imageMeta: ImageMeta | undefined | null) {
  const { imagekitBaseUrl } = useEnvironment();
  const src = useMemo(
    () =>
      imageMeta?.filename
        ? imagekitUrl(imagekitBaseUrl, imageMeta.filename)
        : null,
    [imageMeta?.filename, imagekitBaseUrl],
  );

  return src;
}

function selectImageFromMedia(media: Media, preferredSize: ImageSize) {
  if (!media.sizes) return media;

  const preferredSizeInfo = mediaImageSizes.find(
    (s) => s.name === preferredSize,
  );
  if (!preferredSizeInfo) {
    throw new Error(`Invalid preferredSize '${preferredSize}'`);
  }

  if (
    media.width &&
    preferredSizeInfo.width &&
    media.width <= preferredSizeInfo.width
  ) {
    // original is smaller or same as the preferred size, return original
    return media;
  }

  // use preferredSize or next available larger size (to avoid returning a too big original if preferredSize was not generated)
  const preferredSizeIndex = mediaImageSizes.indexOf(preferredSizeInfo);
  for (
    let index = preferredSizeIndex;
    index < mediaImageSizes.length;
    index++
  ) {
    const size = mediaImageSizes[index].name as ImageSize;

    const image = media.sizes[size];
    if (image && image.filename) return image;
  }

  // if no larger size is available, return the next smaller size
  for (let index = preferredSizeIndex - 1; index >= 0; index--) {
    const size = mediaImageSizes[index].name as ImageSize;

    const image = media.sizes[size];
    if (image && image.filename) return image;
  }

  return media;
}

type ImageSize = keyof NonNullable<Media["sizes"]>;

type ImageMeta = {
  filename?: string | null;
  width?: number | null;
  height?: number | null;
};
