import { getCanonicalRequestUrl } from "~/utils/routing";
import type { Route } from "./+types/route";
import { getMeta, getPosts, tryGetPage } from "~/utils/cms-data.server";
import { parseISO, format } from "date-fns";
import { getSocialImageUrl } from "~/utils/page-meta";
import { getEnvironment } from "~/utils/environment.server";

const rssDateFormat = "eee, dd MMM yyyy HH:mm:ss xx";

export async function loader({ request }: Route.LoaderArgs) {
  const [meta, page, posts] = await Promise.all([
    getMeta(),
    tryGetPage("/articles"),
    getPosts(),
  ]);

  if (!page) throw new Response(null, { status: 404, statusText: "Not Found" });

  const channelLastChanged = posts
    .map((p) => p.publishedAt)
    .filter((d) => !!d)
    .map((d) => format(parseISO(d!), rssDateFormat));

  const content = `<?xml version="1.0" encoding="UTF-8"?>
     <rss xmlns:atom="http://www.w3.org/2005/Atom" xmlns:webfeeds="http://webfeeds.org/rss/1.0" version="2.0">
       <channel>
         <title>${meta.siteName ?? ""}</title>
         <link>${getCanonicalUrl(request, "/articles")}</link>
         <description>${page.meta?.description}</description>
         <language>en</language>
         <ttl>60</ttl>
         <lastBuildDate>${channelLastChanged}</lastBuildDate>
         <atom:link href="${getCanonicalRequestUrl(request)}" rel="self" type="application/rss+xml" />
         <webfeeds:cover image="${getSocialImageUrl(page.meta!, 2400, 1260, getEnvironment(request))}" />
         <webfeeds:icon>${getCanonicalUrl(request, "/favicon-96x96.png")}</webfeeds:icon>
         <webfeeds:logo>${getCanonicalUrl(request, "/favicon.svg")}</webfeeds:logo>
         <webfeeds:accentColor>#2dd4bf</webfeeds:accentColor>
         ${posts
           .map(
             ({ title, content_summary, publishedAt, slug }) => `
           <item>
             <title>${cdata(title)}</title>
             <description>${cdata(content_summary ?? "")}</description>
             ${publishedAt ? `<pubDate>${format(parseISO(publishedAt), rssDateFormat)}</pubDate>` : ""}
             <link>${getCanonicalUrl(request, `/articles/${slug}`)}</link>
             <guid>${getCanonicalUrl(request, `/articles/${slug}`)}</guid>
           </item>`,
           )
           .join("")}
       </channel>
     </rss>`;
  return new Response(content, {
    status: 200,
    headers: {
      "Content-Type": "application/rss+xml",
      encoding: "UTF-8",
    },
  });
}

function getCanonicalUrl(request: Request, pathname: string) {
  const url = getCanonicalRequestUrl(request);
  url.pathname = pathname;
  return url.toString();
}

function cdata(s: string) {
  return `<![CDATA[${s}]]>`;
}
