import { redirect } from "react-router";
import {
  toRelativeUrl,
  getRequestUrl,
  getCanonicalRequestUrl,
} from "./routing";

export async function handleIncomingRequest(request: Request) {
  const url = getRequestUrl(request);

  redirectIfNonCanonicalHostname(request);
  redirectIfPathnameEndsWithSlash(url);

  const pageUrl = toRelativeUrl(url);
  console.log(pageUrl);

  // maintenance screen
  // const maintenance = await getMaintenance(locale);
  // if (
  //   maintenance.maintenanceScreen?.show &&
  //   !(await isAuthenticated(request)) &&
  //   pageUrl !== "/login"
  // ) {
  //   throw new Response(null, {
  //     status: 503,
  //     statusText: "Service Unavailable",
  //   });
  // }

  return { pageUrl };
}

function redirectIfNonCanonicalHostname(request: Request) {
  const canonicalRequestUrl = getCanonicalRequestUrl(request);
  if (getRequestUrl(request).hostname !== canonicalRequestUrl.hostname) {
    throw redirect(canonicalRequestUrl.href, { status: 301 });
  }
}

function redirectIfPathnameEndsWithSlash(url: URL) {
  if (url.pathname !== "/" && url.pathname.endsWith("/")) {
    url.pathname = url.pathname.slice(0, -1);
    throw redirect(toRelativeUrl(url), { status: 301 });
  }
}
