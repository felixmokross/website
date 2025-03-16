import type { ArchiveBlock } from "@fxmk/payload-types";
import { Container } from "~/components/container";
import { formatDate } from "~/utils/format-date";
import { Card } from "~/components/card";

export type ArchiveProps = ArchiveBlock & {
  size: "full" | "small";
};

export function Archive({ posts, size }: ArchiveProps) {
  return size === "full" ? (
    <Container className="mt-16 sm:mt-20">
      <div className="md:border-l md:border-zinc-100 md:pl-6 md:dark:border-zinc-700/40">
        <div className="flex max-w-3xl flex-col space-y-16">
          {(posts as Post[]).map((p) => (
            <FullArticle key={p.slug} article={p} />
          ))}
        </div>
      </div>
    </Container>
  ) : size === "small" ? (
    <div className="flex flex-col gap-16">
      {(posts as Post[]).map((p) => (
        <SmallArticle key={p.slug} article={p} />
      ))}
    </div>
  ) : undefined;
}

type Post = {
  slug: string;
  title: string;
  content_summary: string;
  publishedAt: string;
};

function FullArticle({ article }: { article: Post }) {
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
        <Card.Description>{article.content_summary}</Card.Description>
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

function SmallArticle({ article }: { article: Post }) {
  return (
    <Card as="article">
      <Card.Title href={`/articles/${article.slug}`}>
        {article.title}
      </Card.Title>
      <Card.Eyebrow as="time" dateTime={article.publishedAt} decorate>
        {formatDate(article.publishedAt)}
      </Card.Eyebrow>
      <Card.Description>{article.content_summary}</Card.Description>
      <Card.Cta>Read article</Card.Cta>
    </Card>
  );
}
