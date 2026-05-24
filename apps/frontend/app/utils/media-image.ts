import { mediaImageSizes } from "@fxmk/shared";

type ImageMeta = {
  filename?: string | null;
  width?: number | null;
  height?: number | null;
};

type MediaWithSizes = ImageMeta & {
  sizes?: Partial<Record<string, ImageMeta>> | null;
};

export function selectImageFromMedia(
  media: MediaWithSizes,
  preferredSize: string,
) {
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
    const size = mediaImageSizes[index].name;

    const image = media.sizes[size];
    if (image && image.filename) return image;
  }

  // if no larger size is available, return the next smaller size
  for (let index = preferredSizeIndex - 1; index >= 0; index--) {
    const size = mediaImageSizes[index].name;

    const image = media.sizes[size];
    if (image && image.filename) return image;
  }

  return media;
}
