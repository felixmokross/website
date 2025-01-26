import clsx from "clsx";
import type {
  ComponentType,
  DetailedHTMLProps,
  HTMLAttributes,
  PropsWithChildren,
} from "react";
import { Link } from "react-router";

import { Header } from "./header";
import type {
  Header as HeaderType,
  Footer as FooterType,
  PhotosBlock,
} from "@fxmk/shared";
import { useEnvironment } from "./environment";
import { getLinkHref } from "./links";

type LayoutContainerProps = PropsWithChildren<{
  header: HeaderType;
  footer: FooterType;
}>;

export function LayoutContainer({
  children,
  header,
  footer,
}: LayoutContainerProps) {
  return (
    <>
      <div className="fixed inset-0 flex justify-center sm:px-8">
        <div className="flex w-full max-w-7xl lg:px-8">
          <div className="w-full bg-white ring-1 ring-zinc-100 dark:bg-zinc-900 dark:ring-zinc-300/20" />
        </div>
      </div>
      <div className="relative flex w-full flex-col">
        <Header {...header} />
        <main className="flex-auto">{children}</main>
        <Footer {...footer} />
      </div>
    </>
  );
}

export function NavLink({
  to,
  children,
}: {
  to: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      to={to}
      className="transition hover:text-teal-500 dark:hover:text-teal-400"
    >
      {children}
    </Link>
  );
}

type FooterProps = FooterType;

export function Footer({ navItems, copyrightText }: FooterProps) {
  return (
    <footer className="mt-32 flex-none">
      <ContainerOuter>
        <div className="border-t border-zinc-100 pb-16 pt-10 dark:border-zinc-700/40">
          <ContainerInner>
            <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
              <div className="flex flex-wrap justify-center gap-x-6 gap-y-1 text-sm font-medium text-zinc-800 dark:text-zinc-200">
                {navItems?.map((ni) => (
                  <NavLink key={ni.id} to={getLinkHref(ni.link)}>
                    {ni.link.label}
                  </NavLink>
                ))}
              </div>
              <p className="text-sm text-zinc-400 dark:text-zinc-500">
                {copyrightText}
              </p>
            </div>
          </ContainerInner>
        </div>
      </ContainerOuter>
    </footer>
  );
}

type ContainerOuterProps = DetailedHTMLProps<
  HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;

export function ContainerOuter({
  className,
  children,
  ref,
  ...props
}: ContainerOuterProps) {
  return (
    <div ref={ref} className={clsx("sm:px-8", className)} {...props}>
      <div className="mx-auto w-full max-w-7xl lg:px-8">{children}</div>
    </div>
  );
}

type ContainerInnerProps = DetailedHTMLProps<
  HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;

export function ContainerInner({
  className,
  children,
  ref,
  ...props
}: ContainerInnerProps) {
  return (
    <div
      ref={ref}
      className={clsx("relative px-4 sm:px-8 lg:px-12", className)}
      {...props}
    >
      <div className="mx-auto max-w-2xl lg:max-w-5xl">{children}</div>
    </div>
  );
}

type ContainerProps = ContainerOuterProps;

export function Container({ children, ref, ...props }: ContainerProps) {
  return (
    <ContainerOuter ref={ref} {...props}>
      <ContainerInner>{children}</ContainerInner>
    </ContainerOuter>
  );
}

export function SocialLink({
  icon: Icon,
  ...props
}: React.ComponentPropsWithoutRef<typeof Link> & {
  icon: ComponentType<{ className?: string }>;
}) {
  return (
    <Link className="group -m-1 p-1" {...props}>
      <Icon className="h-6 w-6 fill-zinc-500 transition group-hover:fill-zinc-600 dark:fill-zinc-400 dark:group-hover:fill-zinc-300" />
    </Link>
  );
}

type PhotosProps = PhotosBlock;

export function Photos({ photos }: PhotosProps) {
  const { payloadCmsBaseUrl } = useEnvironment();

  if (!photos) return;

  const rotations = [
    "rotate-2",
    "-rotate-2",
    "rotate-2",
    "rotate-2",
    "-rotate-2",
  ];

  return (
    <div className="mt-16 sm:mt-20">
      <div className="-my-4 flex justify-center gap-5 overflow-hidden py-4 sm:gap-8">
        {photos.map((photo, photoIndex) => (
          <div
            key={photo.id}
            className={clsx(
              "relative aspect-[9/10] w-44 flex-none overflow-hidden rounded-xl bg-zinc-100 sm:w-72 sm:rounded-2xl dark:bg-zinc-800",
              rotations[photoIndex % rotations.length],
            )}
          >
            {typeof photo.image === "object" &&
              photo.image.sizes?.small?.url && (
                <img
                  src={new URL(
                    photo.image.sizes.small.url,
                    payloadCmsBaseUrl,
                  ).toString()}
                  alt=""
                  sizes="(min-width: 640px) 18rem, 11rem"
                  className="absolute inset-0 h-full w-full object-cover"
                />
              )}
          </div>
        ))}
      </div>
    </div>
  );
}
