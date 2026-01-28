"use server";

import { signOut } from "@/app/utils/auth";

export async function logoutAction() {
  await signOut({ redirectTo: "/" });
}
