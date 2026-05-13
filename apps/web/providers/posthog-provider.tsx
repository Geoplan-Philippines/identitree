"use client";

import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";
import { useEffect } from "react";
import { authClient } from "@/lib/auth-client";

function getEnvironment(): string {
  // Preferred: set this in your .env file
  // development | staging | production
  const env = process.env.NEXT_PUBLIC_APP_ENV;

  if (env) {
    return env;
  }

  // Fallback: detect from hostname
  const hostname = window.location.hostname;

  if (hostname === "localhost" || hostname === "127.0.0.1") {
    return "development";
  }

  if (hostname === "identitree-stg.geoplanph.com") {
    return "staging";
  }

  if (hostname === "identitree.geoplanph.com") {
    return "production";
  }

  return "unknown";
}

export function PostHogProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = authClient.useSession();

  // Initialize PostHog once
  useEffect(() => {
    const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST;

    if (!posthogKey || !posthogHost) {
      return;
    }

    const environment = getEnvironment();

    posthog.init(posthogKey, {
      api_host: posthogHost,
      ui_host: "https://us.posthog.com",
      capture_pageview: false,
      capture_pageleave: true,
      person_profiles: "identified_only",
    });

    // Register environment as a super property so all events include it
    posthog.register({
      environment,
    });

    // Optional: store environment on the person profile
    posthog.setPersonProperties({
      environment,
    });
  }, []);

  // Identify users and preserve environment after logout
  useEffect(() => {
    const environment = getEnvironment();

    if (session?.user) {
      posthog.identify(session.user.id, {
        email: session.user.email,
        name: session.user.name,
        environment,
      });

      // Ensure environment remains registered
      posthog.register({
        environment,
      });

      // Optional: keep person profile updated
      posthog.setPersonProperties({
        environment,
      });
    } else {
      // Clears user identity and registered properties
      posthog.reset();

      // Re-register environment so anonymous events still include it
      posthog.register({
        environment,
      });
    }
  }, [session]);

  return <PHProvider client={posthog}>{children}</PHProvider>;
}
