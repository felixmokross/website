import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/page/route.tsx", { id: "routes/home" }),
  route("*", "routes/page/route.tsx"),
  route("/purge-cache", "routes/purge-cache/route.ts"),
  route("/articles/:slug", "routes/post/route.tsx"),
  route("/articles/rss.xml", "routes/rss/route.ts"),
  route("/sitemap.xml", "routes/sitemap/route.ts"),
  route("/robots.txt", "routes/robots/route.ts"),
  route("/version", "routes/version/route.ts"),
] satisfies RouteConfig;
