import type { PropsWithChildren } from "react";
import { useLoaderData, type LoaderFunctionArgs } from "react-router";
import { About } from "~/blocks/about";
import { Archive } from "~/blocks/archive";
import { tryGetPage } from "~/utils/cms-data.server";
import { Columns } from "~/blocks/columns";
import { Container } from "~/components/container";
import { Photos } from "~/blocks/photos";
import { RichText } from "~/components/rich-text/rich-text";
import type { RichTextObject } from "~/components/rich-text/rich-text.model";
import { getCanonicalRequestUrl, getRequestUrl, toUrl } from "~/utils/routing";
import { handleIncomingRequest } from "~/utils/routing.server";

export function meta() {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export async function loader({ request }: LoaderFunctionArgs) {
  const { pageUrl } = await handleIncomingRequest(request);

  const requestUrl = getRequestUrl(request);
  const content = await tryGetPage(toUrl(pageUrl).pathname);
  if (!content) {
    throw new Response(null, { status: 404, statusText: "Not Found" });
  }
  const dataPath = `pages/${content.id}`;

  return {
    origin: requestUrl.origin,
    canonicalUrl: getCanonicalRequestUrl(request).href,
    pageUrl,
    dataPath,
    content,
  };
}

export default function Page() {
  const { content } = useLoaderData<typeof loader>();
  return (
    <>
      {content.hero?.richText && (
        <Container className="mt-9">
          <div className="max-w-2xl">
            {content.hero.richText && (
              <RichText
                content={content.hero.richText as unknown as RichTextObject}
                elements={{
                  h1: ({ children }: PropsWithChildren) => (
                    <h1 className="text-4xl font-bold tracking-tight text-zinc-800 sm:text-5xl dark:text-zinc-100">
                      {children}
                    </h1>
                  ),
                  paragraph: ({ children }: PropsWithChildren) => (
                    <p className="mt-6 text-base text-zinc-600 dark:text-zinc-400">
                      {children}
                    </p>
                  ),
                }}
              />
            )}
          </div>
        </Container>
      )}
      {content.layout?.map((block) => {
        switch (block.blockType) {
          case "photos":
            return <Photos key={block.id} {...block} />;
          case "archive":
            return <Archive key={block.id} {...block} size="full" />;
          case "columns":
            return <Columns key={block.id} {...block} />;
          case "about":
            return <About key={block.id} {...block} />;
          default:
            return null;
        }
      })}
    </>
  );
}
