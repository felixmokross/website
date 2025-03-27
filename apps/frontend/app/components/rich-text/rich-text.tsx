import {
  type ComponentType,
  createContext,
  type ElementType,
  Fragment,
  type PropsWithChildren,
  useContext,
} from "react";
import {
  type RichTextObject,
  type ElementNode,
  type HeadingElementNode,
  type ListElementNode,
  type TextNode,
  IS_BOLD,
  IS_ITALIC,
  IS_UNDERLINE,
  IS_STRIKETHROUGH,
  IS_CODE,
  type Node,
} from "@fxmk/shared";
import { slugify } from "~/utils/slugify";

export type RichTextProps = {
  content?: RichTextObject;
  lineBreakHandling?: LineBreakHandling;
  elements?: Partial<CustomElementConfig>;
  blocks?: BlockConfig;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type BlockConfig = Record<string, ComponentType<any>>;

type CustomElementConfig = {
  bold: ElementType;
  italic: ElementType;
  underline: ElementType;
  strikethrough: ElementType;
  code: ElementType;
  ul: ElementType;
  ol: ElementType;
  li: ElementType;
  h1: ElementType;
  h2: ElementType;
  h3: ElementType;
  h4: ElementType;
  h5: ElementType;
  h6: ElementType;
  link: ComponentType<PropsWithChildren<{ to: string }>> | "a";
  paragraph: ComponentType<PropsWithChildren<{ indent?: number }>> | "p";
  linebreak: ElementType;
};

type RichTextContextValue = {
  content: RichTextObject;
  elements: CustomElementConfig;
  blocks?: BlockConfig;
  lineBreakHandling: LineBreakHandling;
};

type LineBreakHandling = "line-break" | "paragraph";

const RichTextContext = createContext<RichTextContextValue | null>(null);

const defaultElements: CustomElementConfig = {
  bold: "strong",
  italic: "em",
  underline: "u",
  strikethrough: "s",
  code: "code",
  ul: "ul",
  ol: "ol",
  li: "li",
  h1: "h1",
  h2: "h2",
  h3: "h3",
  h4: "h4",
  h5: "h5",
  h6: "h6",
  link: "a",
  paragraph: "p",
  linebreak: "br",
};

function useRichTextContext() {
  const context = useContext(RichTextContext);
  if (!context) throw new Error("RichTextContext is not provided.");
  return context;
}

export function RichText({
  content,
  elements,
  blocks,
  lineBreakHandling = "paragraph",
}: RichTextProps) {
  if (!content) return null;

  const enrichedRootNode = enrichHeadingsWithAnchorIds(content.root);
  return (
    <RichTextContext.Provider
      value={{
        content,
        elements: { ...defaultElements, ...elements },
        blocks,
        lineBreakHandling,
      }}
    >
      {enrichedRootNode.children.map((elementNode, i) => (
        <RenderedElementNode
          key={i}
          node={elementNode}
          isLast={i === content.root.children.length - 1}
        />
      ))}
    </RichTextContext.Provider>
  );
}

function enrichHeadingsWithAnchorIds<
  TNode extends Node | RichTextObject["root"],
>(node: TNode, headingSlugCounts: Map<string, number> = new Map()) {
  const workNode = { ...node };

  if (workNode.type === "heading") {
    const slug = slugify(toPlainText(workNode));
    const count = headingSlugCounts.get(slug) ?? 0;
    headingSlugCounts.set(slug, count + 1);

    workNode.anchorId = count === 0 ? slug : `${slug}-${count + 1}`;
  }

  if ("children" in workNode) {
    workNode.children = workNode.children.map((child) =>
      enrichHeadingsWithAnchorIds(child, headingSlugCounts),
    );
  }

  return workNode;
}

function toPlainText(node: Node): string {
  if (node.type === "text") {
    return node.text ?? "";
  }

  if (node.type === "linebreak") {
    return "\n";
  }

  if ("children" in node) {
    return node.children.map(toPlainText).join("");
  }

  return "";
}

function RenderedElementNode({
  node,
  isLast,
}: {
  node: ElementNode;
  isLast: boolean;
}) {
  const { elements, content, blocks } = useRichTextContext();

  const renderedChildren =
    "children" in node &&
    node.children?.map((child, i) => (
      <RenderedNode
        key={i}
        node={child}
        isLast={i === node.children.length - 1}
      />
    ));

  switch (node.type) {
    case "paragraph":
      return (
        <Line isLast={isLast} indent={node.indent}>
          {renderedChildren}
        </Line>
      );
    case "heading":
      return <Heading node={node}>{renderedChildren}</Heading>;
    case "list":
      return <List node={node}>{renderedChildren}</List>;
    case "listitem":
      return <elements.li>{renderedChildren}</elements.li>;
    case "link": {
      const href =
        node.fields.linkType === "custom"
          ? node.fields.url
          : node.fields.doc.relationTo === "pages"
            ? node.fields.doc.value.pathname
            : node.fields.doc.relationTo === "posts"
              ? `/articles/${node.fields.doc.value.slug}`
              : "#";

      return elements.link === "a" ? (
        <a href={href}>{renderedChildren}</a>
      ) : (
        <elements.link to={href}>{renderedChildren}</elements.link>
      );
    }
    case "block": {
      const BlockComponent = blocks && blocks[node.fields.blockType];
      if (!BlockComponent) {
        throw new Error(
          `Unsupported block type '${node.fields["blockType"]}': ${JSON.stringify(node.fields, null, 2)}`,
        );
      }
      return <BlockComponent {...node.fields} />;
    }
    default:
      throw new Error(
        `Unsupported node type '${node["type"]}': ${JSON.stringify(node, null, 2)}

Rich text object: ${JSON.stringify(content, null, 2)}`,
      );
  }
}

function Heading({
  children,
  node,
}: PropsWithChildren<{ node: HeadingElementNode }>) {
  const { elements } = useRichTextContext();
  const HeadingElement = elements[node.tag];

  return <HeadingElement id={node.anchorId}>{children}</HeadingElement>;
}

function List({
  children,
  node,
}: PropsWithChildren<{ node: ListElementNode }>) {
  const { elements } = useRichTextContext();
  const ListElement = elements[node.tag];
  return <ListElement>{children}</ListElement>;
}

function Line({
  children,
  isLast,
  indent,
}: PropsWithChildren<{ isLast: boolean; indent?: number }>) {
  const { elements, lineBreakHandling } = useRichTextContext();

  switch (lineBreakHandling) {
    case "line-break":
      return (
        <>
          {children}
          {!isLast && <br />}
        </>
      );
    case "paragraph":
      return elements.paragraph === "p" ? (
        <p>{children}</p>
      ) : (
        <elements.paragraph indent={indent}>{children}</elements.paragraph>
      );
  }
}

function RenderedNode({ node, isLast }: { node: Node; isLast: boolean }) {
  const { elements } = useRichTextContext();

  if (node.type === "text") {
    return <RenderedTextNode node={node} />;
  }

  if (node.type === "linebreak") {
    return <elements.linebreak />;
  }

  return <RenderedElementNode node={node} isLast={isLast} />;
}

function RenderedTextNode({ node }: { node: TextNode }) {
  const { elements } = useRichTextContext();

  let result = <RenderedTextLines text={node.text ?? ""} />;

  if (node.format & IS_BOLD) {
    result = <elements.bold>{result}</elements.bold>;
  }

  if (node.format & IS_ITALIC) {
    result = <elements.italic>{result}</elements.italic>;
  }

  if (node.format & IS_UNDERLINE) {
    result = <elements.underline>{result}</elements.underline>;
  }

  if (node.format & IS_STRIKETHROUGH) {
    result = <elements.strikethrough>{result}</elements.strikethrough>;
  }

  if (node.format & IS_CODE) {
    result = <elements.code>{result}</elements.code>;
  }

  return result;
}

function RenderedTextLines({ text }: { text: string }) {
  const lines = text.split("\n");
  return lines.map((line, i) => (
    <Fragment key={i}>
      {line}
      {i < lines.length - 1 && <br />}
    </Fragment>
  ));
}
