import type { Footer as FooterType } from "@fxmk/shared";
import { ContainerOuter, ContainerInner } from "../components/container";
import { getLinkHref } from "../utils/links";
import { Link } from "react-router";

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

function NavLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <Link
      to={to}
      className="transition hover:text-teal-500 dark:hover:text-teal-400"
    >
      {children}
    </Link>
  );
}
