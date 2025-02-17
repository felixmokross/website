import { type Page, type Post } from "@fxmk/shared";
import { getCanonicalRequestUrl } from "~/utils/routing";
import { type LoaderFunctionArgs } from "react-router";
import { loadData } from "~/utils/cms-data.server";

export async function loader({ request }: LoaderFunctionArgs) {
  // const maintenance = await getMaintenance(i18n.fallbackLng);
  // if (
  //   maintenance.maintenanceScreen?.show &&
  //   !(await isAuthenticated(request))
  // ) {
  //   throw new Response(null, {
  //     status: 401,
  //     statusText: "Unauthorized",
  //   });
  // }

  const [pages, posts] = await Promise.all([
    (async () =>
      (await loadData(`pages`, 0, { "where[_status][equals]": "published" }))
        .docs as Page[])(),
    (async () =>
      (await loadData(`posts`, 0, { "where[_status][equals]": "published" }))
        .docs as Post[])(),
  ]);

  const content = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${pages
      .map(
        (p) => `  <url>
    <loc>${getCanonicalRequestUrl(request).origin}${p.pathname}</loc>
    <lastmod>${p.publishedAt?.split("T")[0]}</lastmod>
  </url>`,
      )
      .join("\n")}
    ${posts
      .map(
        (p) => `  <url>
      <loc>${getCanonicalRequestUrl(request).origin}/articles/${p.slug}</loc>
      <lastmod>${p.publishedAt?.split("T")[0]}</lastmod>
    </url>`,
      )
      .join("\n")}
</urlset>`;

  return new Response(content, {
    status: 200,
    headers: {
      "Content-Type": "application/xml",
      encoding: "UTF-8",
    },
  });
}
