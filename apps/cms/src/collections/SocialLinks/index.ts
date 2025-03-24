import { authenticated } from "@/access/authenticated";
import { CollectionConfig } from "payload";
import { socialPlatformOptions } from "@fxmk/shared";

export const SocialLinks: CollectionConfig<"social-links"> = {
  slug: "social-links",
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  admin: {
    useAsTitle: "platform",
  },
  fields: [
    {
      name: "platform",
      type: "select",
      options: socialPlatformOptions,
      required: true,
    },
    {
      name: "url",
      type: "text",
      required: true,
    },
  ],
};
