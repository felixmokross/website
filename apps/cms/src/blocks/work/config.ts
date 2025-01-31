import { Block } from "payload";

export const Work: Block = {
  slug: "work",
  interfaceName: "Work",
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
    },
    {
      name: "items",
      type: "array",
      fields: [
        {
          name: "company",
          type: "text",
          required: true,
        },
        {
          name: "position",
          type: "text",
          required: true,
        },
        {
          name: "start",
          type: "text",
        },
        {
          name: "end",
          type: "text",
        },
        {
          name: "logo",
          type: "upload",
          relationTo: "media",
          required: true,
        },
      ],
    },
  ],
};
