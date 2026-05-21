import { expect, test } from "vitest";

import { imagekitUrl } from "./imagekit";

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
