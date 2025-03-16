import type { CollectionConfig } from "payload";
import { mediaImageSizes } from "@fxmk/shared";

import {
  FixedToolbarFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from "@payloadcms/richtext-lexical";

import { anyone } from "../access/anyone";
import { authenticated } from "../access/authenticated";

export const Media: CollectionConfig = {
  slug: "media",
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  fields: [
    {
      name: "alt",
      type: "text",
      //required: true,
    },
    {
      name: "caption",
      type: "richText",
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            FixedToolbarFeature(),
            InlineToolbarFeature(),
          ];
        },
      }),
    },
  ],
  upload: {
    disableLocalStorage: true,
    mimeTypes: ["image/*", "video/*"],
    displayPreview: true,
    adminThumbnail: "thumbnail",
    focalPoint: true,
    imageSizes: mediaImageSizes,
  },
};
