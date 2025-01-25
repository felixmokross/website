import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("*", "routes/page.tsx"),
  route("/purge-cache", "routes/purge-cache.ts"),
] satisfies RouteConfig;
