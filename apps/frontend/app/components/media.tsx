import type { Media } from "@fxmk/payload-types";
import { MediaImage, type ImageSize } from "./media-image";
import { MediaVideo } from "./media-video";

type MediaProps = {
  media: Media | string;
  preferredImageSize: ImageSize;
};

export function Media({ media, preferredImageSize }: MediaProps) {
  if (!media || typeof media !== "object") return null;

  if (media.mimeType?.startsWith("image/")) {
    return <MediaImage media={media} preferredSize={preferredImageSize} />;
  } else if (media.mimeType?.startsWith("video/")) {
    return <MediaVideo media={media} />;
  }

  console.warn("Unsupported media type", media.mimeType);
  return null;
}
