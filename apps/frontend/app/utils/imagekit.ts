import ImageKit from "imagekit-javascript";

export function imagekitUrl(
  urlEndpoint: string,
  filename: string,
  transformation?: Partial<{
    [key: string]: string;
  }>[],
) {
  return new ImageKit({
    urlEndpoint,
  }).url({ path: filename, transformation });
}
