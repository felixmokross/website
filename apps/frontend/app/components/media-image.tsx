import { mediaImageSizes } from "@fxmk/shared";
import { type Media } from "@fxmk/payload-types";
import { useEnvironment } from "../utils/environment";
import { useMemo } from "react";
import { imagekitImageSources, type ImageCrop } from "~/utils/imagekit";

type MediaImageProps = {
  media: Media | string;
  preferredSize: ImageSize;
  crop?: ImageCrop;
} & Omit<
  React.DetailedHTMLProps<
    React.ImgHTMLAttributes<HTMLImageElement>,
    HTMLImageElement
  >,
  "alt" | "src" | "srcSet"
>;

export function MediaImage({
  media,
  preferredSize = "large",
  crop,
  ...props
}: MediaImageProps) {
  if (typeof media !== "object") return null;

  const imageMeta = selectImageFromMedia(media, preferredSize);

  const sources = useImageSources(imageMeta, crop);
  if (!sources) return null;

  return (
    <img
      src={sources.src}
      srcSet={sources.srcSet}
      alt={media.alt ?? undefined}
      width={imageMeta.width ?? undefined}
      height={imageMeta.height ?? undefined}
      {...props}
    />
  );
}

function useImageSources(
  imageMeta: ImageMeta | undefined | null,
  crop: ImageCrop | undefined,
) {
  const { imagekitBaseUrl } = useEnvironment();
  const sources = useMemo(
    () =>
      imageMeta?.filename
        ? imagekitImageSources(imagekitBaseUrl, imageMeta.filename, crop)
        : null,
    [crop, imageMeta?.filename, imagekitBaseUrl],
  );

  return sources;
}

export function selectImageFromMedia(media: Media, preferredSize: ImageSize) {
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

export type ImageSize = keyof NonNullable<Media["sizes"]>;

type ImageMeta = {
  filename?: string | null;
  width?: number | null;
  height?: number | null;
};
