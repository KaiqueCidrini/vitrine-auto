"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { getAuth } from "../server/auth";
import { LOGIN_PATH } from "../server/current-employee";

export async function signOutAction(): Promise<void> {
  await getAuth().api.signOut({ headers: await headers() });
  redirect(LOGIN_PATH);
}
