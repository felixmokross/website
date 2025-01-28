import { Block } from "payload";

export const SocialLinksBlock: Block = {
  slug: "social-links-block",
  interfaceName: "SocialLinksBlock",
  fields: [
    {
      name: "socialLinks",
      type: "relationship",
      relationTo: "social-links",
      hasMany: true,
      required: true,
    },
  ],
};
