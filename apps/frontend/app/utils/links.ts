import type { Header } from "@fxmk/shared";

export type Link = NonNullable<Header["navItems"]>[number]["link"];

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
