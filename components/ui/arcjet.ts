import arcjet, {
  detectBot,
  fixedWindow,
  tokenBucket,
  shield,
} from "@arcjet/next";
import { env } from "@/lib/env";

export { detectBot, fixedWindow, tokenBucket, shield };

export default arcjet({
  key: env.ARCJET_KEY,
  rules: [],
});
