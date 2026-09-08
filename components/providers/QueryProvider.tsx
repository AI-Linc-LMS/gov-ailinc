"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider, type QueryClientConfig } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";

/**
 * The app's single QueryClient, with a PERSISTED cache.
 *
 * Before this the app had no client-side data cache at all (no React Query, no SWR; the Redux store
 * is a stub), so every navigation refetched cold and every screen re-showed a skeleton even when you
 * had just come from it. Persisting to localStorage additionally fixes the "left the tab for a while,
 * now everything takes forever" case: cached screens paint instantly from the last known data and
 * revalidate in the background instead of blocking on a cold network round-trip.
 */
const QUERY_CONFIG: QueryClientConfig = {
  defaultOptions: {
    queries: {
      /**
       * DEMO REPO ONLY: never stale, so a screen is never refetched twice.
       *
       * Upstream this is 60s, which is right when the data is on a server that
       * can change underneath you. Here the data is deterministic and generated
       * in this browser: re-running a query cannot produce a different answer,
       * so revalidation is pure cost — and the cost lands as a skeleton flashing
       * over a screen the visitor has already seen.
       */
      staleTime: Infinity,
      // Nothing to refetch on mount either, for the same reason.
      refetchOnMount: false,
      // Keep it around long enough that a return-after-lunch still paints from cache.
      gcTime: 24 * 60 * 60 * 1000,
      // The tab-return refetch is handled deliberately per-screen (see useVisibilityRefresh); having
      // every mounted query also refetch on focus is what produced the return-to-tab request storm.
      refetchOnWindowFocus: false,
      // There is no connection to reconnect to.
      refetchOnReconnect: false,
      // A demo handler that throws will throw again; retrying only delays the
      // error state by a round of timers.
      retry: 0,
    },
  },
};

const CACHE_KEY = "ailinc-query-cache";
// Bump to invalidate every persisted entry after a shape change.
const CACHE_BUSTER = "v1";

export function QueryProvider({ children }: { children: React.ReactNode }) {
  // useState so the client is created once per mount and never re-created on re-render.
  const [queryClient] = useState(() => new QueryClient(QUERY_CONFIG));
  const [persister] = useState(() =>
    typeof window === "undefined"
      ? null
      : createSyncStoragePersister({ storage: window.localStorage, key: CACHE_KEY })
  );

  /**
   * SSR pass: keep the client, drop only the persistence.
   *
   * This used to return bare `{children}`, which removed the QueryClientProvider
   * along with the persister. Anything calling `useQuery` during the server
   * render then threw "No QueryClient set", React abandoned the Suspense
   * boundary, and the page logged the minified #419 and fell back to rendering
   * on the client. That is exactly what /dashboard did on every load, because
   * DashboardV2 opens with a useQuery.
   *
   * There is nothing to persist on the server (no localStorage), but the CLIENT
   * is still needed for the render to complete, so provide it plainly here and
   * add persistence only in the browser.
   */
  if (!persister) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  }

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister,
        maxAge: 24 * 60 * 60 * 1000,
        buster: CACHE_BUSTER,
        dehydrateOptions: {
          // Never persist a failed/pending query — only successful data is worth restoring.
          shouldDehydrateQuery: (query) => query.state.status === "success",
        },
      }}
    >
      {children}
    </PersistQueryClientProvider>
  );
}
