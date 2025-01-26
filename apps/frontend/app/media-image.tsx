import type { Media } from "@fxmk/shared";
import { useEnvironment } from "./environment";

type ImageProps = { media: Media | string } & React.DetailedHTMLProps<
  React.ImgHTMLAttributes<HTMLImageElement>,
  HTMLImageElement
>;
export function MediaImage({ media, ...props }: ImageProps) {
  const { payloadCmsBaseUrl } = useEnvironment();

  if (typeof media !== "object") return null;

  return (
    <img
      src={new URL(
        media.sizes?.large?.url || media.url || "",
        payloadCmsBaseUrl,
      ).toString()}
      alt={media.alt ?? ""}
      {...props}
    />
  );
}
