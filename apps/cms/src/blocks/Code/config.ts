import type { Block } from "payload";

export const Code: Block = {
  slug: "code",
  interfaceName: "CodeBlock",
  fields: [
    {
      name: "language",
      type: "text",
    },
    {
      name: "code",
      type: "code",
      label: false,
      required: true,
      admin: {
        language: "", // The Monaco editor defaults to TypeScript
      },
    },
  ],
};
