import { resolve6 } from "dns/promises";
import { CollectionSlug, GlobalSlug, PayloadRequest } from "payload";
import * as cookie from "cookie";
import { Page } from "@/payload-types";

export function getFullCollectionCacheKey(collectionSlug: CollectionSlug) {
  return collectionSlug;
}

export function getGlobalCacheKey(globalSlug: GlobalSlug) {
  return `globals_${globalSlug}`;
}

export function getCollectionItemCacheKey(
  collectionSlug: CollectionSlug,
  itemKey: string,
) {
  return `${collectionSlug}_${itemKey}`;
}

export function getPageCacheKey(page: Page) {
  return getCollectionItemCacheKey("pages", page.pathname.replaceAll("/", ":"));
}

export async function refreshCacheForAllPages(
  req: PayloadRequest,
  actionType: "purge-and-prime" | "prime-only",
) {
  const pages = (
    await req.payload.find({
      collection: "pages",
      pagination: false,
      depth: 0,
    })
  ).docs;

  if (actionType === "purge-and-prime") {
    console.log(`Purging cache for all pages.`);

    for (const page of pages) {
      await refreshCacheForTarget(req, {
        type: "purge",
        cacheKey: getPageCacheKey(page),
      });
    }

    console.log(`Purged cache for all pages.`);
  }

  console.log(`Priming cache for all pages.`);

  for (const page of pages) {
    await refreshCacheForTarget(req, {
      type: "prime",
      pageUrl: page.pathname,
    });
  }

  console.log(`Primed cache for all pages.`);
}

export type RefreshCacheActionType = RefreshCacheAction["type"];

type RefreshCacheAction =
  | { type: "purge"; cacheKey: string }
  | { type: "prime"; pageUrl: string };

export async function refreshCacheForTarget(
  req: PayloadRequest,
  action: RefreshCacheAction,
) {
  if (!process.env.CACHE_REFRESH_TARGET_TYPE) {
    throw new Error("CACHE_REFRESH_TARGET is not set");
  }
  if (!process.env.CACHE_REFRESH_TARGET_ARG) {
    throw new Error("CACHE_REFRESH_TARGET_ARG is not set");
  }

  switch (process.env.CACHE_REFRESH_TARGET_TYPE) {
    case "single":
      await refreshCache(req, process.env.CACHE_REFRESH_TARGET_ARG, action);
      return;

    case "fly":
      const [appName, internalPort] =
        process.env.CACHE_REFRESH_TARGET_ARG.split(",");
      await refreshCacheForFlyTarget(req, appName, internalPort, action);
      return;

    default:
      throw new Error(
        `Unsupported CACHE_REFRESH_TARGET type: ${process.env.CACHE_REFRESH_TARGET_TYPE}`,
      );
  }
}

async function refreshCacheForFlyTarget(
  req: PayloadRequest,
  appName: string,
  internalPort: string,
  action: RefreshCacheAction,
) {
  console.log(
    `Determining Fly frontend VM URLs for cache refresh (app=${appName}, internalPort=${internalPort})`,
  );

  const targetUrls = await queryFlyVmUrls(appName, parseInt(internalPort, 10));

  console.log(`Refreshing cache at ${targetUrls.length} frontend VMs`);

  const results = await Promise.allSettled(
    targetUrls.map((targetUrls) => refreshCache(req, targetUrls, action)),
  );
  const failed = results.filter(isPromiseRejectedResult);

  if (failed.length === 0) {
    console.log(
      `Successfully refreshed cache at ${targetUrls.length} frontend VMs`,
    );
  } else {
    console.error(
      `Failed to refresh cache at ${failed.length} frontend VMs:\n${failed.map((r, i) => `[${i}] ${r}`).join("\n")}`,
    );
  }
}

async function queryFlyVmUrls(appName: string, port: number) {
  const address = `global.${appName}.internal`;
  const ipv6s = await resolve6(address);
  const urls = ipv6s.map((ip) => `http://[${ip}]:${port}`);

  return urls;
}

async function refreshCache(
  req: PayloadRequest,
  targetUrl: string,
  action: RefreshCacheAction,
) {
  switch (action.type) {
    case "purge":
      await purgeCache(req, targetUrl, action.cacheKey);
      return;
    case "prime":
      await primeCache(req, targetUrl, action.pageUrl);
      return;
  }
}

async function purgeCache(
  req: PayloadRequest,
  targetUrl: string,
  cacheKey: string,
) {
  console.log(`Purging cache at ${targetUrl} for ${cacheKey}...`);
  const response = await fetch(`${targetUrl}/purge-cache`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: getAuthorizationHeaderValue(req),
    },
    body: JSON.stringify({ cacheKey }),
  });

  if (!response.ok) {
    throw new Error(
      `Failed to purge cache at ${targetUrl} for ${cacheKey}, status code was ${response.status}`,
    );
  }

  console.log(`Purged cache at ${targetUrl} for ${cacheKey}.`);
}

async function primeCache(
  req: PayloadRequest,
  targetUrl: string,
  pageUrl: string,
) {
  const absolutePageUrl = new URL(pageUrl, targetUrl);

  console.log(`Priming cache at ${absolutePageUrl}...`);

  const response = await fetch(absolutePageUrl, {
    headers: {
      Authorization: getAuthorizationHeaderValue(req),
    },
  });
  if (!response.ok) {
    throw new Error(
      `Failed to prime cache at ${response.url}, received status code ${response.status}`,
    );
  }

  console.log(`Primed cache at ${targetUrl} for ${pageUrl}.`);
}

function isPromiseRejectedResult(
  result: PromiseSettledResult<unknown>,
): result is PromiseRejectedResult {
  return result.status === "rejected";
}

function getAuthorizationHeaderValue(req: PayloadRequest) {
  return `JWT ${getUserToken(req)}`;
}

function getUserToken(req: PayloadRequest) {
  const cookieHeader = req.headers.get("Cookie");
  if (!cookieHeader) throw new Error("No 'Cookie' header found");

  const cookies = cookie.parse(cookieHeader);

  if (!cookies["payload-token"]) {
    throw new Error("No 'payload-token' cookie found");
  }
  return cookies["payload-token"];
}
