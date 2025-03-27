import type { CollectionConfig } from "payload";
import { mediaImageSizes } from "@fxmk/shared";

import {
  FixedToolbarFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from "@payloadcms/richtext-lexical";

import { authenticated } from "../access/authenticated";
import { generateAltTextEndpoint } from "./generate-alt-text-endpoint";

export const Media: CollectionConfig = {
  slug: "media",
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  endpoints: [generateAltTextEndpoint],
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Alternative Text",
          fields: [
            {
              name: "alt",
              label: "Alternative Text",
              type: "text",
              admin: {
                description:
                  "A brief description of the media for screen readers and search engines. It is not displayed on the page but is important for accessibility. For images an alt text can be generated automatically using OpenAI.",
                components: {
                  afterInput: [
                    "@/collections/generate-alt-text-button#GenerateAltTextButton",
                  ],
                },
              },
            },
          ],
        },
        {
          label: "Caption",
          fields: [
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
        },
      ],
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
