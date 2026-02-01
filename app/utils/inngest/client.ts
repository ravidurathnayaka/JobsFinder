import { Inngest } from "inngest";

// Send events to local dev server in development so they appear at http://localhost:8288/events
const isDev =
  typeof process !== "undefined" && process.env?.NODE_ENV !== "production";
const devBaseUrl = "http://localhost:8288";
const baseUrl =
  process.env?.INNGEST_EVENT_API_BASE_URL ??
  (isDev ? devBaseUrl : undefined);

export const inngest = new Inngest({
  id: "jobsFinder",
  ...(baseUrl && { baseUrl }),
});
