import { cache } from "react";
import { config } from "@/lib/config";
import type { ClientInfo } from "@/lib/services/client.service";
import { DEMO_MODE } from "@/lib/demo/config";
import { DEMO_CLIENT_INFO } from "@/lib/demo/db/tenant";

const FALLBACK_CLIENT_INFO: ClientInfo = {
  name: "LMS Platform",
  features: [],
};

export const getClientInfo = cache(
  async (host?: string): Promise<ClientInfo> => {
    // DEMO REPO ONLY: this is the one API call made from the server, so the
    // axios adapter that serves everything else cannot reach it. Answering from
    // the seed keeps the very first server-rendered paint correctly branded —
    // without it the app would flash the "LMS Platform" fallback before
    // hydration replaced it with the tenant.
    if (DEMO_MODE) return DEMO_CLIENT_INFO;

    try {
      const res = await fetch(
        `${config.apiBaseUrl}/api/clients/${config.clientId}/client-info/`,
        {
          next: {
            revalidate: 120,
          },
        }
      );

      if (!res.ok) {
        return FALLBACK_CLIENT_INFO;
      }

      return res.json();
    } catch (err) {
      // API unreachable (e.g. ECONNREFUSED during build or when backend is down)
      return FALLBACK_CLIENT_INFO;
    }
  }
);
