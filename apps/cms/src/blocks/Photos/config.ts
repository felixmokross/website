import { Block } from "payload";

export const PhotosBlock: Block = {
  slug: "photos",
  interfaceName: "PhotosBlock",
  fields: [
    {
      type: "array",
      name: "photos",
      label: "Photos",
      minRows: 1,
      maxRows: 5,
      fields: [
        {
          type: "upload",
          name: "image",
          relationTo: "media",
          required: true,
        },
      ],
    },
  ],
};
