import type { ProjectsBlock } from "@fxmk/shared";
import { Card } from "~/components/card";
import { Container } from "~/components/container";
import { LinkIcon } from "~/components/icons";
import { MediaImage } from "~/components/media-image";

export function Projects({ items }: ProjectsBlock) {
  if (!items) return null;
  return (
    <Container className="mt-16 sm:mt-20">
      <ul
        role="list"
        className="grid grid-cols-1 gap-x-12 gap-y-16 sm:grid-cols-2 lg:grid-cols-3"
      >
        {items.map((item) => (
          <Card as="li" key={item.id}>
            {item.logo && (
              <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-md shadow-zinc-800/5 ring-1 ring-zinc-900/5 dark:border dark:border-zinc-700/50 dark:bg-zinc-800 dark:ring-0">
                <MediaImage
                  preferredSize="thumbnail"
                  media={item.logo}
                  className="h-8 w-8"
                />
              </div>
            )}
            <h2 className="mt-6 text-base font-semibold text-zinc-800 dark:text-zinc-100">
              {item.url ? (
                <Card.Link to={item.url}>{item.title}</Card.Link>
              ) : (
                item.title
              )}
            </h2>
            <Card.Description>{item.description}</Card.Description>
            {item.linkText && (
              <p className="relative z-10 mt-6 flex text-sm font-medium text-zinc-400 transition group-hover:text-teal-500 dark:text-zinc-200">
                <LinkIcon className="h-6 w-6 flex-none" />
                <span className="ml-2">{item.linkText}</span>
              </p>
            )}
          </Card>
        ))}
      </ul>
    </Container>
  );
}
