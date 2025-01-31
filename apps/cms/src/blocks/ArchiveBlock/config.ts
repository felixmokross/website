import type { Block } from "payload";

export const Archive: Block = {
  slug: "archive",
  interfaceName: "ArchiveBlock",
  fields: [
    {
      name: "posts",
      type: "json",
      hidden: true,
      virtual: true,
      hooks: {
        afterRead: [
          async ({ siblingData, req }) => {
            return (
              await req.payload.find({
                collection: "posts",
                pagination: false,
                sort: "-publishedAt",
                limit: siblingData.limit,
              })
            ).docs.map((p) => ({
              // Note: We cannot use `select` here since content_summary is a virtual field, thus we need the full posts to be loaded
              title: p.title,
              slug: p.slug,
              content_summary: p.content_summary,
              publishedAt: p.publishedAt,
            }));
          },
        ],
      },
    },
    {
      name: "limit",
      type: "number",
      admin: {
        step: 1,
        description: "Leave empty to show all posts",
      },
      label: "Maximum number of posts to show",
    },
  ],
  labels: {
    plural: "Archives",
    singular: "Archive",
  },
};
