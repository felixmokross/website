import clsx from "clsx";
import { useEnvironment } from "../utils/environment";
import type { PhotosBlock } from "@fxmk/shared";

export function Photos({ photos }: PhotosProps) {
  const { payloadCmsBaseUrl } = useEnvironment();

  if (!photos) return;

  const rotations = [
    "rotate-2",
    "-rotate-2",
    "rotate-2",
    "rotate-2",
    "-rotate-2",
  ];

  return (
    <div className="mt-16 sm:mt-20">
      <div className="-my-4 flex justify-center gap-5 overflow-hidden py-4 sm:gap-8">
        {photos.map((photo, photoIndex) => (
          <div
            key={photo.id}
            className={clsx(
              "relative aspect-[9/10] w-44 flex-none overflow-hidden rounded-xl bg-zinc-100 sm:w-72 sm:rounded-2xl dark:bg-zinc-800",
              rotations[photoIndex % rotations.length],
            )}
          >
            {typeof photo.image === "object" &&
              photo.image.sizes?.small?.url && (
                <img
                  src={new URL(
                    photo.image.sizes.small.url,
                    payloadCmsBaseUrl,
                  ).toString()}
                  alt=""
                  sizes="(min-width: 640px) 18rem, 11rem"
                  className="absolute inset-0 h-full w-full object-cover"
                />
              )}
          </div>
        ))}
      </div>
    </div>
  );
}
export type PhotosProps = PhotosBlock;
