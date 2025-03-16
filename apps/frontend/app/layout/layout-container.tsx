import { Header } from "~/layout/header";
import { Footer } from "./footer";
import type {
  Header as HeaderType,
  Footer as FooterType,
} from "@fxmk/payload-types";
import { type PropsWithChildren } from "react";
import { NavigationBar } from "./navigation-bar";

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
        <NavigationBar />
      </div>
    </>
  );
}
export type LayoutContainerProps = PropsWithChildren<{
  header: HeaderType;
  footer: FooterType;
}>;
