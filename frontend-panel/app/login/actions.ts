"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function login(formData: FormData) {
  const accessKey = String(formData.get("accessKey") ?? "");
  const expectedAccessKey = process.env.PANEL_ACCESS_KEY;

  if (!expectedAccessKey) {
    throw new Error("Missing PANEL_ACCESS_KEY");
  }

  if (accessKey !== expectedAccessKey) {
    redirect("/login?error=invalid");
  }

  const cookieStore = await cookies();

  cookieStore.set("panel_access", "granted", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });

  redirect("/");
}