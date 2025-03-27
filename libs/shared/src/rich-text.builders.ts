import {
  type TextNode,
  type ElementNode,
  type Node,
  IS_BOLD,
  IS_ITALIC,
  IS_UNDERLINE,
  IS_STRIKETHROUGH,
  IS_CODE,
  type RichTextObject,
  type HeadingElementNode,
  type LinkElementNode,
  type LineBreakNode,
  type ParagraphElementNode,
} from "./rich-text.model";

export function richTextRoot(...children: ElementNode[]): RichTextObject {
  return {
    root: { type: "root", children },
  };
}

export function text(
  text: string | undefined,
  {
    bold,
    italic,
    underline,
    strikethrough,
    code,
  }: {
    bold?: true;
    italic?: true;
    underline?: true;
    strikethrough?: true;
    code?: true;
  } = {},
): TextNode {
  const node: TextNode = { type: "text", text, format: 0 };
  if (bold) node.format += IS_BOLD;
  if (italic) node.format += IS_ITALIC;
  if (underline) node.format += IS_UNDERLINE;
  if (strikethrough) node.format += IS_STRIKETHROUGH;
  if (code) node.format += IS_CODE;
  return node;
}

export function lineBreak(): LineBreakNode {
  return { type: "linebreak" };
}

export function bold(t: string): TextNode {
  return text(t, { bold: true });
}

export function italic(t: string): TextNode {
  return text(t, { italic: true });
}

export function underline(t: string): TextNode {
  return text(t, { underline: true });
}

export function strikethrough(t: string): TextNode {
  return text(t, { strikethrough: true });
}

export function code(t: string): TextNode {
  return text(t, { code: true });
}

export function unsupportedElementWithoutChildren(): ElementNode {
  // @ts-expect-error Intentionally creating an unsupported element
  return { type: "NOT_SUPPORTED" } as ElementNode;
}

export function listitem(...children: Node[]): ElementNode {
  return { type: "listitem", children };
}

export function paragraph(
  ...args: Node[] | [number, ...Node[]]
): ParagraphElementNode {
  return typeof args[0] === "number"
    ? {
        type: "paragraph",
        indent: args[0],
        children: args.slice(1) as Node[],
      }
    : {
        type: "paragraph",
        children: args as Node[],
      };
}

export function heading(
  tag: HeadingElementNode["tag"],
  ...children: Node[]
): HeadingElementNode {
  return { type: "heading", tag, children };
}

export function list(
  tag: "ul" | "ol",
  ...children: ElementNode[]
): ElementNode {
  return { type: "list", tag, children };
}

export function customUrlLink(
  url: string,
  ...children: Node[]
): LinkElementNode {
  return {
    type: "link",
    fields: { linkType: "custom", url },
    children,
  };
}

export function internalLink(
  pathname: string,
  ...children: Node[]
): LinkElementNode {
  return {
    type: "link",
    fields: {
      linkType: "internal",
      doc: {
        relationTo: "pages",
        value: { pathname },
      },
    },
    children,
  };
}
