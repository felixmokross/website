import { expect, test } from "vitest";

import {
  imageCropTransformation,
  imagekitImageSources,
  imagekitUrl,
} from "./imagekit";
import { selectImageFromMedia } from "./media-image";

test("builds an ImageKit URL for a plain path", () => {
  expect(imagekitUrl("https://ik.imagekit.io/demo", "folder/photo.jpg")).toBe(
    "https://ik.imagekit.io/demo/folder/photo.jpg",
  );
});

test("builds an ImageKit URL with transformations", () => {
  expect(
    imagekitUrl("https://ik.imagekit.io/demo", "folder/photo.jpg", [
      { width: "1200", height: "630" },
    ]),
  ).toBe("https://ik.imagekit.io/demo/folder/photo.jpg?tr=w-1200,h-630");
});

test("builds responsive cropped ImageKit sources", () => {
  expect(
    imagekitImageSources("https://ik.imagekit.io/demo", "folder/photo.jpg", {
      aspectRatio: 1,
      widths: [300, 150, 300],
    }),
  ).toEqual({
    src: "https://ik.imagekit.io/demo/folder/photo.jpg?tr=w-300,h-300,c-maintain_ratio,fo-center",
    srcSet:
      "https://ik.imagekit.io/demo/folder/photo.jpg?tr=w-150,h-150,c-maintain_ratio,fo-center 150w, https://ik.imagekit.io/demo/folder/photo.jpg?tr=w-300,h-300,c-maintain_ratio,fo-center 300w",
  });
});

test("calculates crop height from aspect ratio", () => {
  expect(imageCropTransformation(9 / 10, 288)).toMatchObject({
    width: "288",
    height: "320",
    crop: "maintain_ratio",
    focus: "center",
  });
});

test("selects the preferred generated Payload image size", () => {
  const image = selectImageFromMedia(
    media({
      filename: "original.jpg",
      width: 2400,
      sizes: {
        medium: { filename: "medium.jpg", width: 900 },
        large: { filename: "large.jpg", width: 1400 },
      },
    }),
    "medium",
  );

  expect(image).toMatchObject({ filename: "medium.jpg" });
});

test("selects the next larger Payload image size when preferred is missing", () => {
  const image = selectImageFromMedia(
    media({
      filename: "original.jpg",
      width: 2400,
      sizes: {
        thumbnail: { filename: "thumbnail.jpg", width: 300 },
        medium: { filename: "medium.jpg", width: 900 },
      },
    }),
    "small",
  );

  expect(image).toMatchObject({ filename: "medium.jpg" });
});

test("uses the original image when it is not larger than the preferred size", () => {
  const image = selectImageFromMedia(
    media({
      filename: "original.jpg",
      width: 500,
      sizes: {
        small: { filename: "small.jpg", width: 600 },
      },
    }),
    "small",
  );

  expect(image).toMatchObject({ filename: "original.jpg" });
});

function media(value: Parameters<typeof selectImageFromMedia>[0]) {
  return value;
}
