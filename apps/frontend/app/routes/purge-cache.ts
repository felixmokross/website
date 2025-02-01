import { type ActionFunctionArgs } from "react-router";
import { purgeCacheFor } from "~/common/cms-data.server";
import { isAuthenticated } from "~/common/auth";

export async function action({ request }: ActionFunctionArgs) {
  if (!(await isAuthenticated(request))) {
    return new Response(null, { status: 401 });
  }

  const { cacheKey } = await request.json();
  console.log(`Purging cache for ${cacheKey}`);
  await purgeCacheFor(cacheKey);
  console.log(`Cache purged for ${cacheKey}`);

  return new Response(null, { status: 204 });
}
