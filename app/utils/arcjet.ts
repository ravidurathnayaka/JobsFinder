import arcjet, {
  detectBot,
  fixedWindow,
  protectSignup,
  sensitiveInfo,
  shield,
  slidingWindow,
} from "@arcjet/next";

// Re-export the rules to simplify imports inside handlers
export {
  detectBot,
  fixedWindow,
  protectSignup,
  sensitiveInfo,
  shield,
  slidingWindow,
};

import { env } from "@/lib/env";

// Create a base Arcjet instance for use by each handler
export default arcjet({
  key: env.ARCJET_KEY,
  rules: [],
});
