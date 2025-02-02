import { type Location } from "react-router";

export function getRequestUrl(request: Request) {
  const url = new URL(request.url);
  if (request.headers.get("X-Forwarded-Proto") === "https") {
    url.protocol = "https";
  }

  return url;
}

export function getCanonicalRequestUrl(request: Request) {
  if (!process.env.CANONICAL_HOSTNAME) {
    throw new Error("Missing CANONICAL_HOSTNAME");
  }
  const url = getRequestUrl(request);
  url.hostname = process.env.CANONICAL_HOSTNAME;
  return url;
}

export function toRelativeUrl(urlOrLocation: URL | Location) {
  if (urlOrLocation instanceof URL) {
    return urlOrLocation.toString().replace(urlOrLocation.origin, "");
  }

  return urlOrLocation.pathname + urlOrLocation.search + urlOrLocation.hash;
}

export function toUrl(relativeUrl: string, baseUrl?: string) {
  return new URL(relativeUrl, baseUrl || "http://dummy");
}
