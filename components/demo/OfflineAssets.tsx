"use client";

/**
 * Registers the bundled icon sets before anything renders.
 *
 * `@iconify/react` resolves any icon it does not already know by calling
 * api.iconify.design. Handing it the collections up front means it never asks:
 * icons paint on the first frame, and the demo works with the network unplugged.
 *
 * Runs at module scope rather than in an effect. An effect fires after the first
 * paint, which is exactly one frame too late - icons would flash in.
 */

import { addCollection } from "@iconify/react";
import bundle from "@/lib/demo/icons/bundle.json";

type IconifyCollection = Parameters<typeof addCollection>[0];

let registered = false;

function registerBundledIcons() {
  if (registered) return;
  registered = true;
  for (const collection of Object.values(bundle as Record<string, unknown>)) {
    addCollection(collection as IconifyCollection);
  }
}

registerBundledIcons();

/** Renders nothing; exists so the import above runs inside the client bundle. */
export function OfflineAssets() {
  return null;
}
