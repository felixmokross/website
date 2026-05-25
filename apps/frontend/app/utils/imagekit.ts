import { buildSrc, type Transformation } from "@imagekit/javascript";

export type ImageCrop = {
  aspectRatio: number;
  widths: number[];
};

export type ImageCropSource = {
  width?: number | null;
  height?: number | null;
};

export function imagekitUrl(
  urlEndpoint: string,
  filename: string,
  transformation?: Transformation[],
) {
  return buildSrc({
    urlEndpoint,
    src: filename,
    transformation,
  });
}

export function imagekitImageSources(
  urlEndpoint: string,
  filename: string,
  crop?: ImageCrop,
  source?: ImageCropSource,
) {
  if (!crop) {
    return {
      src: imagekitUrl(urlEndpoint, filename),
    };
  }

  const widths = normalizeWidths(
    crop.widths,
    getMaxCropWidth(crop.aspectRatio, source),
  );
  if (widths.length === 0) {
    return {
      src: imagekitUrl(urlEndpoint, filename),
    };
  }

  const srcSet = widths
    .map((width) => {
      const transformation = imageCropTransformation(crop.aspectRatio, width);
      return `${imagekitUrl(urlEndpoint, filename, [transformation])} ${width}w`;
    })
    .join(", ");

  return {
    src: imagekitUrl(urlEndpoint, filename, [
      imageCropTransformation(crop.aspectRatio, widths[widths.length - 1]),
    ]),
    srcSet,
  };
}

export function imageCropTransformation(
  aspectRatio: number,
  width: number,
): Transformation {
  if (aspectRatio <= 0) {
    throw new Error(`Invalid crop aspect ratio '${aspectRatio}'`);
  }

  return {
    width: width.toString(),
    height: Math.round(width / aspectRatio).toString(),
    crop: "maintain_ratio",
    focus: "center",
  };
}

function normalizeWidths(widths: number[], maxWidth?: number) {
  return [
    ...new Set(
      widths
        .map(Math.round)
        .filter((width) => width > 0)
        .map((width) => (maxWidth ? Math.min(width, maxWidth) : width)),
    ),
  ].sort((a, b) => a - b);
}

function getMaxCropWidth(aspectRatio: number, source?: ImageCropSource) {
  const maxWidths = [
    source?.width ?? undefined,
    source?.height && aspectRatio > 0
      ? Math.floor(source.height * aspectRatio)
      : undefined,
  ]
    .filter((width): width is number => typeof width === "number" && width > 0)
    .map(Math.floor)
    .filter((width) => width > 0);

  if (maxWidths.length === 0) return undefined;

  return Math.min(...maxWidths);
}
