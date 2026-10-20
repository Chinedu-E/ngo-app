"use server";

import { redirect } from "next/navigation";
import {
  clearAdminSessionCookie,
  setAdminSessionCookie,
  verifyPassword,
} from "@/lib/admin/auth";

export type LoginState = {
  error?: string;
};

export async function loginAction(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const password = String(formData.get("password") ?? "");

  if (!password) {
    return { error: "Enter the admin password." };
  }

  try {
    if (!verifyPassword(password)) {
      return { error: "Incorrect password." };
    }
    await setAdminSessionCookie();
  } catch {
    return { error: "Admin authentication is not configured." };
  }

  redirect("/admin");
}

export async function logoutAction(): Promise<void> {
  await clearAdminSessionCookie();
  redirect("/admin/login");
}
