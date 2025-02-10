import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "react-router";

import type { Route } from "./+types/root";
import appStylesheet from "./app.css?url";
import prismStylesheet from "./prism.css?url";
import { LayoutContainer } from "./layout/layout-container";
import { getFooter, getHeader } from "./utils/cms-data.server";
import { EnvironmentContext } from "./utils/environment";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
  { rel: "stylesheet", href: appStylesheet },
  { rel: "stylesheet", href: prismStylesheet },
  {
    rel: "icon",
    type: "image/png",
    sizes: "96x96",
    href: `/favicon-96x96.png`,
  },
  {
    rel: "icon",
    type: "image/svg+xml",
    href: `/favicon.svg`,
  },
  {
    rel: "shortcut icon",
    href: `/favicon.ico`,
  },
  {
    rel: "apple-touch-icon",
    sizes: "180x180",
    href: `/apple-touch-icon.png`,
  },
  {
    rel: "manifest",
    href: `/site.webmanifest`,
  },
];

export const meta: Route.MetaFunction = () => [
  { name: "apple-mobile-web-app-title", content: "fxmk.dev" },
];

export async function loader() {
  const [header, footer] = await Promise.all([getHeader(), getFooter()]);

  return {
    header,
    footer,
    environment: {
      payloadCmsBaseUrl: process.env.PAYLOAD_CMS_BASE_URL as string,
      imagekitBaseUrl: process.env.IMAGEKIT_BASE_URL as string,
    },
  };
}

export function Layout({ children }: { children: React.ReactNode }) {
  const { header, footer, environment } = useLoaderData<typeof loader>();
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="flex h-full bg-zinc-50 dark:bg-black">
        <EnvironmentContext.Provider value={environment}>
          <div className="flex w-full">
            <LayoutContainer header={header} footer={footer}>
              {children}
            </LayoutContainer>
          </div>
        </EnvironmentContext.Provider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="container mx-auto p-4 pt-16">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full overflow-x-auto p-4">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
