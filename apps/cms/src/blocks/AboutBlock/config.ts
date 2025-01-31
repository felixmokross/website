import {
  BlocksFeature,
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from "@payloadcms/richtext-lexical";
import { Block } from "payload";
import { SocialLinksBlock } from "../SocialLinksBlock/config";

const SocialLink: Block = {
  slug: "social-link",
  fields: [
    {
      name: "socialLink",
      type: "relationship",
      relationTo: "social-links",
    },
    {
      name: "label",
      type: "text",
      required: true,
    },
  ],
};

const Separator: Block = {
  slug: "separator",
  fields: [],
};

export const AboutBlock: Block = {
  slug: "about",
  interfaceName: "AboutBlock",
  fields: [
    {
      name: "richText",
      type: "richText",
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            HeadingFeature({ enabledHeadingSizes: ["h1", "h2", "h3", "h4"] }),
            FixedToolbarFeature(),
            InlineToolbarFeature(),
            BlocksFeature({ blocks: [SocialLinksBlock] }),
          ];
        },
      }),
      label: false,
    },
    {
      name: "portraitImage",
      type: "upload",
      relationTo: "media",
    },
    {
      name: "links",
      type: "blocks",
      blocks: [SocialLink, Separator],
    },
  ],
  labels: {
    plural: "About",
    singular: "About",
  },
};
