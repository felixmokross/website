import type { Block } from "payload";

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from "@payloadcms/richtext-lexical";

export const Archive: Block = {
  slug: "archive",
  interfaceName: "ArchiveBlock",
  fields: [
    {
      name: "introContent",
      type: "richText",
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            HeadingFeature({ enabledHeadingSizes: ["h1", "h2", "h3", "h4"] }),
            FixedToolbarFeature(),
            InlineToolbarFeature(),
          ];
        },
      }),
      label: "Intro Content",
    },
    {
      name: "populateBy",
      type: "select",
      defaultValue: "collection",
      options: [
        {
          label: "Collection",
          value: "collection",
        },
        {
          label: "Individual Selection",
          value: "selection",
        },
      ],
    },
    {
      name: "relationTo",
      type: "select",
      admin: {
        condition: (_, siblingData) => siblingData.populateBy === "collection",
      },
      defaultValue: "posts",
      label: "Collections To Show",
      options: [
        {
          label: "Posts",
          value: "posts",
        },
      ],
    },
    {
      name: "posts",
      type: "json",
      hidden: true,
      virtual: true,
      hooks: {
        afterRead: [
          async ({ siblingData, req }) => {
            if (
              siblingData?.populateBy !== "collection" ||
              siblingData?.relationTo !== "posts"
            ) {
              return [];
            }

            const result = await req.payload.find({
              collection: "posts",
              pagination: false,
              select: {
                title: true,
                slug: true,
                publishedAt: true,
                content: true,
              },
            });

            return result.docs.map((p) => ({
              ...p,
              // only take first paragraph of each post
              // TODO ideally transform to plain text here
              content: {
                root: {
                  children: [
                    ...p.content.root.children
                      .filter((e) => e.type === "paragraph")
                      .slice(0, 1),
                  ],
                },
              },
            }));
          },
        ],
      },
    },
    {
      name: "categories",
      type: "relationship",
      admin: {
        condition: (_, siblingData) => siblingData.populateBy === "collection",
      },
      hasMany: true,
      label: "Categories To Show",
      relationTo: "categories",
    },
    {
      name: "limit",
      type: "number",
      admin: {
        condition: (_, siblingData) => siblingData.populateBy === "collection",
        step: 1,
      },
      defaultValue: 10,
      label: "Limit",
    },
    {
      name: "selectedDocs",
      type: "relationship",
      admin: {
        condition: (_, siblingData) => siblingData.populateBy === "selection",
      },
      hasMany: true,
      label: "Selection",
      relationTo: ["posts"],
    },
  ],
  labels: {
    plural: "Archives",
    singular: "Archive",
  },
};
