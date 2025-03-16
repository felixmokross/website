import type { Media } from "@fxmk/shared";
import { useEnvironment } from "../utils/environment";
import { useMemo } from "react";
import { imagekitUrl } from "~/utils/imagekit";

type ImageProps = {
  media: Media | string;
  preferredSize: keyof NonNullable<Media["sizes"]>;
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

  const imageMeta =
    media.sizes &&
    media.sizes[preferredSize] &&
    media?.sizes[preferredSize].filename
      ? media.sizes[preferredSize]
      : media;

  const src = useImageSrc(imageMeta);
  if (!src) return null;

  return (
    <img
      src={src}
      alt={media.alt ?? ""}
      width={imageMeta.width ?? undefined}
      height={imageMeta.height ?? undefined}
      {...props}
    />
  );
}

function useImageSrc(
  imageMeta:
    | {
        filename?: string | null;
        width?: number | null;
        height?: number | null;
      }
    | undefined
    | null,
) {
  const { imagekitBaseUrl } = useEnvironment();
  const src = useMemo(
    () =>
      imageMeta?.filename
        ? imagekitUrl(imagekitBaseUrl, imageMeta.filename, [
            {
              width: imageMeta.width?.toString(),
              height: imageMeta.height?.toString(),
            },
          ])
        : null,
    [imageMeta?.filename, imageMeta?.width, imageMeta?.height, imagekitBaseUrl],
  );

  return src;
}
