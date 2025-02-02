import clsx from "clsx";
import type { DetailedHTMLProps, HTMLAttributes } from "react";

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
