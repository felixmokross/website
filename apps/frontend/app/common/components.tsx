import clsx from "clsx";
import type {
  ComponentType,
  DetailedHTMLProps,
  HTMLAttributes,
  PropsWithChildren,
} from "react";
import { Link } from "react-router";

import { Header } from "../layout/header";
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

function ChevronRightIcon(props: React.ComponentPropsWithoutRef<"svg">) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" {...props}>
      <path
        d="M6.75 5.75 9.25 8l-2.5 2.25"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Card<T extends React.ElementType = "div">({
  as,
  className,
  children,
}: Omit<React.ComponentPropsWithoutRef<T>, "as" | "className"> & {
  as?: T;
  className?: string;
}) {
  const Component = as ?? "div";

  return (
    <Component
      className={clsx(className, "group relative flex flex-col items-start")}
    >
      {children}
    </Component>
  );
}

Card.Link = function CardLink({
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof Link>) {
  return (
    <>
      <div className="absolute -inset-x-4 -inset-y-6 z-0 scale-95 bg-zinc-50 opacity-0 transition group-hover:scale-100 group-hover:opacity-100 sm:-inset-x-6 sm:rounded-2xl dark:bg-zinc-800/50" />
      <Link {...props}>
        <span className="absolute -inset-x-4 -inset-y-6 z-20 sm:-inset-x-6 sm:rounded-2xl" />
        <span className="relative z-10">{children}</span>
      </Link>
    </>
  );
};

Card.Title = function CardTitle<T extends React.ElementType = "h2">({
  as,
  href,
  children,
}: Omit<React.ComponentPropsWithoutRef<T>, "as" | "href"> & {
  as?: T;
  href?: string;
}) {
  const Component = as ?? "h2";

  return (
    <Component className="text-base font-semibold tracking-tight text-zinc-800 dark:text-zinc-100">
      {href ? <Card.Link to={href}>{children}</Card.Link> : children}
    </Component>
  );
};

Card.Description = function CardDescription({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <p className="relative z-10 mt-2 text-sm text-zinc-600 dark:text-zinc-400">
      {children}
    </p>
  );
};

Card.Cta = function CardCta({ children }: { children: React.ReactNode }) {
  return (
    <div
      aria-hidden="true"
      className="relative z-10 mt-4 flex items-center text-sm font-medium text-teal-500"
    >
      {children}
      <ChevronRightIcon className="ml-1 h-4 w-4 stroke-current" />
    </div>
  );
};

Card.Eyebrow = function CardEyebrow<T extends React.ElementType = "p">({
  as,
  decorate = false,
  className,
  children,
  ...props
}: Omit<React.ComponentPropsWithoutRef<T>, "as" | "decorate"> & {
  as?: T;
  decorate?: boolean;
}) {
  const Component = as ?? "p";

  return (
    <Component
      className={clsx(
        className,
        "relative z-10 order-first mb-3 flex items-center text-sm text-zinc-400 dark:text-zinc-500",
        decorate && "pl-3.5",
      )}
      {...props}
    >
      {decorate && (
        <span
          className="absolute inset-y-0 left-0 flex items-center"
          aria-hidden="true"
        >
          <span className="h-4 w-0.5 rounded-full bg-zinc-200 dark:bg-zinc-500" />
        </span>
      )}
      {children}
    </Component>
  );
};
