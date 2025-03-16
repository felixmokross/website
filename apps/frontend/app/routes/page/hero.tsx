import type { Page } from "@fxmk/payload-types";
import type { PropsWithChildren } from "react";
import { Container } from "~/components/container";
import { RichText } from "~/components/rich-text/rich-text";
import type { RichTextObject } from "~/components/rich-text/rich-text.model";
import { SocialLinksBlock } from "./social-links-block";
import { Prose } from "~/components/prose";
import { useLocation } from "react-router";
import clsx from "clsx";

export function Hero({ richText }: NonNullable<Page["hero"]>) {
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  if (!richText) return null;
  return (
    <>
      <Container className={clsx(isHomePage ? "mt-9" : "mt-16 sm:mt-32")}>
        <Prose className="max-w-2xl">
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
        </Prose>
      </Container>
    </>
  );
}
