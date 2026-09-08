/**
 * DEMO REPO ONLY: renders nothing.
 *
 * This file must EXIST — it is the route's Suspense boundary, and deleting it
 * broke client-side navigation outright: the URL changed while the previous
 * page stayed on screen, because a suspending route had nothing to suspend
 * into. Upstream it renders a full-page shimmer.
 *
 * Returning null keeps the boundary and drops the shimmer. The demo's data is
 * generated in this browser and resolves in the same tick, so there is nothing
 * worth showing a skeleton for; a skeleton here only ever flashes.
 */
export default function Loading() {
  return null;
}
