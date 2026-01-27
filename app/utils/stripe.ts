import Stripe from "stripe";
import { env } from "@/lib/env";

export const stripe = new Stripe(env.SECRET_STRIPE_KEY, {
  apiVersion: "2025-12-15.clover",
  typescript: true,
});
