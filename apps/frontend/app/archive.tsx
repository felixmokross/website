import type { ArchiveBlock } from "@fxmk/shared";
import { Card, Container } from "./components";
import { formatDate } from "./formatDate";
import type { RichTextObject } from "./rich-text.model";
import { RichText } from "./rich-text";
import { richTextRoot } from "./rich-text.builders";

export type ArchiveProps = ArchiveBlock;

export function Archive({ populateBy, posts }: ArchiveProps) {
  if (populateBy !== "collection") return null;

  return (
    <Container className="mt-16 sm:mt-20">
      <div className="md:border-l md:border-zinc-100 md:pl-6 md:dark:border-zinc-700/40">
        <div className="flex max-w-3xl flex-col space-y-16">
          {(posts as Post[]).map((p) => (
            <Article key={p.slug} article={p} />
          ))}
        </div>
      </div>
    </Container>
  );
}

type Post = {
  slug: string;
  title: string;
  content: RichTextObject;
  publishedAt: string;
};

function Article({ article }: { article: Post }) {
  return (
    <article className="md:grid md:grid-cols-4 md:items-baseline">
      <Card className="md:col-span-3">
        <Card.Title href={`/articles/${article.slug}`}>
          {article.title}
        </Card.Title>
        <Card.Eyebrow
          as="time"
          dateTime={article.publishedAt}
          className="md:hidden"
          decorate
        >
          {formatDate(article.publishedAt)}
        </Card.Eyebrow>
        <Card.Description>
          <RichText
            content={richTextRoot(
              article.content.root.children.find(
                (n) => n.type === "paragraph",
              )!,
            )}
          />
        </Card.Description>
        <Card.Cta>Read article</Card.Cta>
      </Card>
      <Card.Eyebrow
        as="time"
        dateTime={article.publishedAt}
        className="mt-1 hidden md:block"
      >
        {formatDate(article.publishedAt)}
      </Card.Eyebrow>
    </article>
  );
}
