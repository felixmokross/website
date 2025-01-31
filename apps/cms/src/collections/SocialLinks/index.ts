import { authenticated } from "@/access/authenticated";
import { auth } from "node_modules/payload/dist/auth/operations/auth";
import { CollectionConfig } from "payload";

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
      options: [
        {
          label: "Instagram",
          value: "instagram",
        },
        {
          label: "LinkedIn",
          value: "linkedin",
        },
        {
          label: "Bluesky",
          value: "bluesky",
        },
        {
          label: "GitHub",
          value: "github",
        },
        {
          label: "Email",
          value: "email",
        },
      ],
      required: true,
    },
    {
      name: "url",
      type: "text",
      required: true,
    },
  ],
};
