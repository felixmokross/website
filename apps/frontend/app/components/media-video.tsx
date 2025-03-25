import type { Media } from "@fxmk/payload-types";
import { useEnvironment } from "~/utils/environment";

type MediaVideoProps = {
  media: Media | string;
};
export function MediaVideo({ media }: MediaVideoProps) {
  const { imagekitBaseUrl } = useEnvironment();

  if (typeof media !== "object") return null;
  return (
    <video
      src={`${imagekitBaseUrl}/${media.filename}`}
      autoPlay
      muted
      loop
      playsInline
      controlsList="nodownload nofullscreen noremoteplayback"
      disablePictureInPicture
      disableRemotePlayback
    >
      {media.alt && <p>{media.alt}</p>}
    </video>
  );
}
