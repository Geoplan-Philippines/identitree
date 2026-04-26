"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createApiUrl } from "@/lib/api/config";

/**
 * Server Action to log out the user.
 * This proxies the sign-out request to the API and clears local session cookies.
 */
export async function logoutAction() {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  try {
    // 1. Call the API sign-out endpoint to invalidate the session in the database
    await fetch(createApiUrl("/auth/sign-out"), {
      method: "POST",
      headers: {
        Cookie: cookieHeader,
      },
      // We don't necessarily need to wait for a successful response if we're clearing cookies anyway,
      // but it's good practice for database cleanup.
      cache: "no-store",
    });
  } catch (error) {
    console.error("Failed to call sign-out API:", error);
  }

  // 2. Clear the session cookies locally in the browser
  // Better Auth default cookie names
  cookieStore.delete("better-auth.session_token");
  
  // Also clear any other potential auth cookies if they exist
  // (Standard practice to ensure local state is wiped)
  cookieStore.delete("better-auth.session_token.sig");

  // 3. Redirect to the login page
  redirect("/login");
}
