export async function isAuthenticated(request: Request): Promise<boolean> {
  const authHeaderValue = request.headers.get("Authorization");

  if (!authHeaderValue) {
    return false;
  }

  // TODO consider validating the token here using the Payload secret instead of having to request the CMS
  // Do we use a JWT in all cases, though?
  const result = await fetch(
    `${process.env.PAYLOAD_CMS_BASE_URL}/api/users/me`,
    {
      headers: { Authorization: authHeaderValue },
    },
  );

  return result.ok && !!(await result.json()).user?.id;
}
