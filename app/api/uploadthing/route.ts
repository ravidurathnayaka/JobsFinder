import { createRouteHandler } from "uploadthing/next";
import { env } from "@/lib/env";
import { ourFileRouter } from "./core";

// Export routes for Next App Router
// Explicitly set runtime to nodejs to avoid edge runtime issues
export const runtime = "nodejs";

export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
  config: {
    // Explicitly set callback URL if needed
    callbackUrl: env.NEXT_PUBLIC_URL
      ? `${env.NEXT_PUBLIC_URL}/api/uploadthing`
      : undefined,
  },
});
