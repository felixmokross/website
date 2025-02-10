import type { Media } from "@fxmk/shared";
import { gracefully } from "./gracefully";

export function getAltFromMedia(media: Media | string | undefined | null) {
  return gracefully(media, "alt") || "";
}
