import type { Redirect } from "@fxmk/shared";

export type Link = Pick<
  NonNullable<Redirect["to"]>,
  "type" | "reference" | "url"
>;

export function getLinkHref(link: Link): string {
  switch (link.type) {
    case "custom":
      return link.url ?? "#";
    case "reference":
      return link.reference?.relationTo === "pages"
        ? typeof link.reference.value === "object"
          ? link.reference.value.pathname
          : "#"
        : link.reference?.relationTo === "posts"
          ? typeof link.reference.value === "object"
            ? `/articles/${link.reference.value.slug}`
            : "#"
          : "#";
    default:
      return "#";
  }
}
