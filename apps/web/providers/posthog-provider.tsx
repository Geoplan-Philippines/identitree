"use client";

import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";
import { useEffect } from "react";
import { authClient } from "@/lib/auth-client";

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = authClient.useSession();

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_POSTHOG_KEY) {
      posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
        api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
        ui_host: "https://us.posthog.com",
        capture_pageview: false,
        capture_pageleave: true,
      });

      // Automatically detect and tag the environment
      const hostname = window.location.hostname;
      const env = hostname.includes("stg") 
        ? "staging" 
        : hostname === "identitree.geoplanph.com" 
          ? "production" 
          : "development";

      posthog.register({ environment: env });
    }
  }, []);

  useEffect(() => {
    if (session?.user) {
      posthog.identify(session.user.id, {
        email: session.user.email,
        name: session.user.name,
      });
    } else {
      posthog.reset();
    }
  }, [session]);

  return <PHProvider client={posthog}>{children}</PHProvider>;
}
