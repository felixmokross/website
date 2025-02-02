import { Block } from "payload";

export const ProjectsBlock: Block = {
  slug: "projects",
  interfaceName: "ProjectsBlock",
  fields: [
    {
      name: "items",
      type: "array",
      fields: [
        {
          name: "title",
          type: "text",
        },
        {
          name: "description",
          type: "textarea",
        },
        {
          name: "url",
          label: "URL",
          type: "text",
        },
        {
          name: "linkText",
          type: "text",
        },
        {
          name: "logo",
          type: "upload",
          relationTo: "media",
        },
      ],
    },
  ],
};
