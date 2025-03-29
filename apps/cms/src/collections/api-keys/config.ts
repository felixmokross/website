import { CollectionConfig } from "payload";

export const ApiKeys: CollectionConfig = {
  slug: "api-keys",
  labels: {
    singular: "API Key",
    plural: "API Keys",
  },
  auth: {
    disableLocalStrategy: true,
    useAPIKey: true,
  },
  admin: {
    defaultColumns: ["name", "createdAt", "updatedAt"],
    useAsTitle: "name",
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
      unique: true,
    },
  ],
};
