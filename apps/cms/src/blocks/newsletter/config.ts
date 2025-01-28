import { Block } from "payload";

export const Newsletter: Block = {
  slug: "newsletter",
  interfaceName: "Newsletter",
  fields: [
    {
      name: "title",
      type: "text",
      label: "Title",
      required: true,
    },
    {
      name: "description",
      type: "richText",
      label: "Description",
    },
    {
      name: "placeholder",
      type: "text",
      label: "Placeholder",
    },
    {
      name: "buttonText",
      type: "text",
      label: "Button Text",
    },
  ],
};
