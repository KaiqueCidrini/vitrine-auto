import { toNextJsHandler } from "better-auth/next-js";

import { getAuth } from "@/features/auth/server/auth";

function handleAuthRequest(request: Request): Promise<Response> {
  return getAuth().handler(request);
}

export const { GET, POST } = toNextJsHandler(handleAuthRequest);
