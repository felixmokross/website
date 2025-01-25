import type { Page } from "@fxmk/shared";

export const IS_BOLD = 1;
export const IS_ITALIC = 1 << 1;
export const IS_STRIKETHROUGH = 1 << 2;
export const IS_UNDERLINE = 1 << 3;
export const IS_CODE = 1 << 4;
export const IS_SUBSCRIPT = 1 << 5;
export const IS_SUPERSCRIPT = 1 << 6;
export const IS_HIGHLIGHT = 1 << 7;

export type RichTextObject = {
  root: { type: "root"; children: ElementNode[] };
};

export type TextNode = { type: "text"; text?: string; format: number };

export type ElementNode =
  | ListItemElementNode
  | ParagraphElementNode
  | LinkElementNode
  | ListElementNode
  | HeadingElementNode;

export type Node = ElementNode | TextNode | LineBreakNode;

export type LineBreakNode = { type: "linebreak" };

type BaseElementNode = { children: Node[] };

export type ListItemElementNode = BaseElementNode & {
  type: "listitem";
};

export type ParagraphElementNode = BaseElementNode & {
  type: "paragraph";
  indent?: number;
};

export type HeadingElementNode = BaseElementNode & {
  type: "heading";
  tag: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
};

export type LinkElementNode = BaseElementNode & {
  type: "link";
  fields:
    | {
        linkType: "custom";
        url: string;
      }
    | {
        linkType: "internal";
        doc: {
          relationTo: "pages";
          value: Page;
        };
      };
};

export type ListElementNode = BaseElementNode & {
  type: "list";
  tag: "ul" | "ol";
};
