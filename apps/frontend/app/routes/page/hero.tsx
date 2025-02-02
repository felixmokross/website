import type { Page } from "@fxmk/shared";
import type { PropsWithChildren } from "react";
import { Container } from "~/components/container";
import { RichText } from "~/components/rich-text/rich-text";
import type { RichTextObject } from "~/components/rich-text/rich-text.model";
import { SocialLinksBlock } from "./social-links-block";

export function Hero({ richText }: NonNullable<Page["hero"]>) {
  if (!richText) return null;
  return (
    <>
      <Container className="mt-9">
        <div className="max-w-2xl">
          <RichText
            content={richText as unknown as RichTextObject}
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
            blocks={{ "social-links-block": SocialLinksBlock }}
          />
        </div>
      </Container>
    </>
  );
}
