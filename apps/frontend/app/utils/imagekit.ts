import { buildSrc, type Transformation } from "@imagekit/javascript";

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
