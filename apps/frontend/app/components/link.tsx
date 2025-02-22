import type { Ref } from "react";
import {
  Link as ReactRouterLink,
  type LinkProps as ReactRouterLinkProps,
} from "react-router";

export type LinkProps = Omit<ReactRouterLinkProps, "to"> & {
  ref?: Ref<HTMLAnchorElement>;
  to: string;
};

export function Link({ to, children, ...props }: LinkProps) {
  const isExternal = to.startsWith("http://") || to.startsWith("https://");
  return (
    <ReactRouterLink
      to={to}
      {...props}
      {...(isExternal
        ? { target: "_blank", rel: "noreferrer", reloadDocument: true }
        : {})}
    >
      {children}
    </ReactRouterLink>
  );
}
