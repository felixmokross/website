import type { AboutBlock } from "@fxmk/shared";
import { Container } from "~/components/container";
import { RichText } from "~/components/rich-text/rich-text";
import type { RichTextObject } from "~/components/rich-text/rich-text.model";
import type { PropsWithChildren } from "react";
import { MediaImage } from "~/components/media-image";
import clsx from "clsx";
import { Link } from "react-router";
import { getSocialIcon } from "./social-links-block";

export function About({ richText, portraitImage, links }: AboutBlock) {
  return (
    <Container className="mt-16 sm:mt-32">
      <div className="grid grid-cols-1 gap-y-16 lg:grid-cols-2 lg:grid-rows-[auto_1fr] lg:gap-y-12">
        {portraitImage && (
          <div className="lg:pl-20">
            <div className="max-w-xs px-2.5 lg:max-w-none">
              <MediaImage
                media={portraitImage}
                sizes="(min-width: 1024px) 32rem, 20rem"
                className="aspect-square rotate-3 rounded-2xl bg-zinc-100 object-cover dark:bg-zinc-800"
              />
            </div>
          </div>
        )}
        <div className="lg:order-first lg:row-span-2">
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
          />
        </div>
        {links && links.length > 0 && (
          <div className="lg:pl-20">
            <ul role="list" className="space-y-4">
              {links.map((link) => {
                switch (link.blockType) {
                  case "social-link":
                    return (
                      <li key={link.id}>
                        {typeof link.socialLink === "object" &&
                          link.socialLink && (
                            <SocialLink
                              href={link.socialLink.url}
                              icon={getSocialIcon(link.socialLink.platform)}
                            >
                              {link.label}
                            </SocialLink>
                          )}
                      </li>
                    );
                  case "separator":
                    return (
                      <li key={link.id} className="py-4">
                        <hr className="border-t border-zinc-100 dark:border-zinc-700/40" />
                      </li>
                    );
                  default:
                    return null;
                }
              })}
            </ul>
          </div>
        )}
      </div>
    </Container>
  );
}

function SocialLink({
  className,
  href,
  children,
  icon: Icon,
}: {
  className?: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <li className={clsx(className, "flex")}>
      <Link
        to={href}
        className="group flex text-sm font-medium text-zinc-800 transition hover:text-teal-500 dark:text-zinc-200 dark:hover:text-teal-500"
      >
        <Icon className="h-6 w-6 flex-none fill-zinc-500 transition group-hover:fill-teal-500" />
        <span className="ml-4">{children}</span>
      </Link>
    </li>
  );
}
