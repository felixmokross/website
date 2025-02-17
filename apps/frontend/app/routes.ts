import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/page/route.tsx", { id: "routes/home" }),
  route("*", "routes/page/route.tsx"),
  route("/purge-cache", "routes/purge-cache/route.ts"),
  route("/articles/:slug", "routes/post/route.tsx"),
  route("/sitemap.xml", "routes/sitemap/route.ts"),
  route("/robots.txt", "routes/robots/route.ts"),
] satisfies RouteConfig;
