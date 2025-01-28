import { RichTextField, TextField } from "payload";
import {
  BlocksFeature,
  defaultEditorConfig,
  FixedToolbarFeature,
  getEnabledNodes,
  HeadingFeature,
  HorizontalRuleFeature,
  InlineToolbarFeature,
  lexicalEditor,
  OrderedListFeature,
  sanitizeServerEditorConfig,
  UnorderedListFeature,
} from "@payloadcms/richtext-lexical";
import { createHeadlessEditor } from "@payloadcms/richtext-lexical/lexical/headless";
import {
  SerializedEditorState,
  $getRoot,
} from "@payloadcms/richtext-lexical/lexical";
import { Banner } from "@/blocks/Banner/config";
import { Code } from "@/blocks/Code/config";
import { MediaBlock } from "@/blocks/MediaBlock/config";
import payloadConfig from "@/payload.config";

export function contentFields(): [RichTextField, TextField] {
  return [
    {
      name: "content",
      type: "richText",
      editor: lexicalEditor({
        features: ({ rootFeatures }) => [
          ...rootFeatures,
          ...additionalFeatures,
        ],
      }),
      label: false,
      required: true,
    },
    {
      name: "content_summary",
      type: "text",
      virtual: true,
      hidden: true,
      hooks: {
        afterRead: [
          async ({ siblingData }) => {
            if (!siblingData.content) return null;
            return await richTextToPlainText({
              root: {
                type: "root",
                version: 1,
                direction: "ltr",
                format: "",
                indent: 0,
                children: [
                  ...siblingData.content.root.children
                    .filter((e) => e.type === "paragraph")
                    .slice(0, 1),
                ],
              },
            });
          },
        ],
      },
    },
  ];
}

const additionalFeatures = [
  HeadingFeature({
    enabledHeadingSizes: ["h1", "h2", "h3", "h4"],
  }),
  BlocksFeature({ blocks: [Banner, Code, MediaBlock] }),
  FixedToolbarFeature(),
  InlineToolbarFeature(),
  HorizontalRuleFeature(),
  UnorderedListFeature(),
  OrderedListFeature(),
];

async function createEditor() {
  return createHeadlessEditor({
    nodes: getEnabledNodes({
      editorConfig: await getEditorConfig(),
    }),
  });
}

async function getEditorConfig() {
  return await sanitizeServerEditorConfig(
    {
      ...defaultEditorConfig,
      features: [...defaultEditorConfig.features, ...additionalFeatures],
    },
    await payloadConfig,
  );
}

async function richTextToPlainText(richText: SerializedEditorState) {
  const editor = await createEditor();

  try {
    editor.update(
      () => {
        editor.setEditorState(editor.parseEditorState(richText));
      },
      { discrete: true }, // This should commit the editor state immediately
    );
  } catch (e) {
    console.error("Failed to update headless editor", e);
  }

  return editor.getEditorState().read(() => $getRoot().getTextContent());
}
