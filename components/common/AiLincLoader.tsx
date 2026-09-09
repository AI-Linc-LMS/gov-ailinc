"use client";

/**
 * The full-bleed brand loader.
 *
 * The exported name (and this file's name) are deliberately unchanged: several
 * routes import `AiLincLoader`, and the symbol is an internal identifier, not
 * something a user ever reads. What a user does see is the mark and the caption,
 * and both are now the tenant's. The mark is the TSEM device drawn inline rather
 * than fetched, so the loader paints before any asset request resolves. It is the
 * same geometry as /public/logos/tsem-mark-*.svg: three ascending arches on a
 * common plinth. Keep the two in step if either is redrawn.
 *
 * The gradient stops are inline literals, not the `--tsem-brand-*` tokens this
 * file used to read. Those tokens were left at the pre-palette indigo into
 * emerald, so the loader painted a mark in colours the shipped SVGs no longer
 * use: the token indirection was what let the two drift apart unseen.
 * The literals below are byte-identical to the stops in tsem-mark-color.svg
 * (institutional blue #1B4F8A into sanctioned green #0E7A3C) precisely so a grep
 * for either value finds both places at once. Deliberately not `var(--primary-500)`
 * either: the SVGs are fixed assets that do not follow tenant branding, so a
 * tenant-reactive loader would drift from them the moment branding changed.
 * `--tsem-brand-gradient-start` / `-end` in app/globals.css now have no consumer.
 */

import { Box, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";

export interface AiLincLoaderProps {
  variant?: "fullscreen" | "inline";
  label?: string;
  subMessage?: string;
  size?: number;
  hidePercent?: boolean;
}

export function AiLincLoader({
  variant = "fullscreen",
  label = "TSEM · LOADING",
  subMessage,
  size,
  hidePercent = false,
}: AiLincLoaderProps) {
  const [pct, setPct] = useState(0);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    let p = 0;
    let timer: ReturnType<typeof setTimeout> | null = null;
    const tick = () => {
      if (!mountedRef.current) return;
      p += Math.random() * 11 + 4;
      if (p >= 99) {
        setPct(99);
        return;
      }
      setPct(Math.floor(p));
      timer = setTimeout(tick, 80 + Math.random() * 110);
    };
    const startTimer = setTimeout(tick, 120);
    return () => {
      mountedRef.current = false;
      clearTimeout(startTimer);
      if (timer) clearTimeout(timer);
    };
  }, []);

  const markSize = size ?? (variant === "fullscreen" ? 320 : 180);

  // The three arches, drawn outer-then-inner so evenodd hollows each one out.
  const markPath =
    "M 66 210 L 66 162 A 34 34 0 0 1 134 162 L 134 210 Z M 86 210 L 86 162 A 14 14 0 0 1 114 162 L 114 210 Z M 148 210 L 148 114 A 40 40 0 0 1 228 114 L 228 210 Z M 168 210 L 168 114 A 20 20 0 0 1 208 114 L 208 210 Z M 242 210 L 242 62 A 46 46 0 0 1 334 62 L 334 210 Z M 262 210 L 262 62 A 26 26 0 0 1 308 62 L 308 210 Z";
  // The plinth the arches stand on. Kept a separate path rather than a fourth
  // subpath of `markPath`, because evenodd would punch a notch out of it wherever
  // it overlaps the feet of the arches.
  const plinthPath = "M 66 206 L 334 206 L 334 228 L 66 228 Z";
  // Roughly the outline length of `markPath`. The trace sweep reads as a wipe, so
  // it only has to be at least the path length; too short and the sweep stalls
  // mid-mark. Recompute if the geometry above changes.
  const traceLength = 2200;

  const content = (
    <Box
      sx={{
        width: markSize,
        height: Math.round(markSize * 0.6),
        mx: "auto",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          width: "100%",
          height: "100%",
          animation:
            "ailinc-mark-fadein 0.6s ease-out both, ailinc-mark-breathe 3.4s ease-in-out 0.6s infinite",
        }}
      >
        <Box
          component="svg"
          viewBox="0 0 400 240"
          sx={{
            width: "100%",
            height: "100%",
            display: "block",
          }}
          aria-hidden
        >
          <defs>
            <linearGradient
              id="ailinc-loader-grad"
              x1="66"
              y1="120"
              x2="334"
              y2="120"
              gradientUnits="userSpaceOnUse"
            >
              <stop
                offset="0"
                style={{ stopColor: "#1B4F8A" }}
              />
              <stop
                offset="1"
                style={{ stopColor: "#0E7A3C" }}
              />
            </linearGradient>
            <linearGradient
              id="ailinc-loader-trace"
              x1="66"
              y1="120"
              x2="334"
              y2="120"
              gradientUnits="userSpaceOnUse"
            >
              <stop
                offset="0"
                style={{
                  stopColor: "#FFFFFF",
                  stopOpacity: 0,
                }}
              />
              <stop
                offset="0.5"
                style={{
                  stopColor: "#FFFFFF",
                  stopOpacity: 0.9,
                }}
              />
              <stop
                offset="1"
                style={{
                  stopColor: "#FFFFFF",
                  stopOpacity: 0,
                }}
              />
            </linearGradient>
          </defs>
          {/* No rotation. The arches sit square on their plinth; the -7deg tilt
              that used to be here belonged to the vendor's mark. */}
          <g>
            <path
              d={markPath}
              fill="url(#ailinc-loader-grad)"
              fillRule="evenodd"
            />
            <path d={plinthPath} fill="url(#ailinc-loader-grad)" />
            <path
              d={markPath}
              fill="none"
              stroke="url(#ailinc-loader-trace)"
              strokeWidth={4}
              strokeLinecap="round"
              fillRule="evenodd"
              style={{
                strokeDasharray: traceLength,
                strokeDashoffset: traceLength,
                mixBlendMode: "screen",
                animation:
                  "ailinc-mark-trace 2.6s cubic-bezier(.22,1,.36,1) infinite",
              }}
            />
          </g>
        </Box>
      </Box>

      <Box
        component="style"
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes ailinc-mark-fadein {
              from { opacity: 0; transform: scale(0.92); }
              to   { opacity: 1; transform: scale(1); }
            }
            @keyframes ailinc-mark-breathe {
              0%, 100% { transform: scale(1); }
              50%      { transform: scale(1.035); }
            }
            @keyframes ailinc-mark-trace {
              0%   { stroke-dashoffset: ${traceLength}; }
              60%  { stroke-dashoffset: 0; }
              100% { stroke-dashoffset: -${traceLength}; }
            }
          `,
        }}
      />
    </Box>
  );

  const captionBlock = (
    <Box sx={{ textAlign: "center", mt: 3 }}>
      {!hidePercent && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 1.5,
            fontFamily:
              "ui-monospace, SFMono-Regular, Menlo, Monaco, 'Cascadia Mono', 'Liberation Mono', monospace",
            fontSize: 11,
            letterSpacing: "0.2em",
            color: "var(--font-secondary)",
          }}
        >
          <Box component="span" sx={{ fontWeight: 500 }}>
            {label}
          </Box>
          <Box
            component="span"
            sx={{
              display: "inline-block",
              minWidth: 24,
              // Sanctioned green, matching the gradient end of the mark above.
              color: "#0E7A3C",
              fontVariantNumeric: "tabular-nums",
              fontWeight: 600,
              textAlign: "right",
            }}
          >
            {String(pct).padStart(2, "0")}
          </Box>
        </Box>
      )}
      {subMessage && (
        <Typography
          variant="body2"
          sx={{
            mt: 1.5,
            color: "var(--font-secondary)",
            fontSize: "0.875rem",
            fontWeight: 500,
          }}
        >
          {subMessage}
        </Typography>
      )}
    </Box>
  );

  if (variant === "inline") {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          py: 4,
          backgroundColor: "transparent",
        }}
        role="status"
        aria-label={label}
      >
        {content}
        {captionBlock}
      </Box>
    );
  }

  return (
    <Box
      role="status"
      aria-label={label}
      sx={{
        position: "fixed",
        inset: 0,
        zIndex: 1400,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "transparent",
      }}
    >
      {content}
      {captionBlock}
    </Box>
  );
}
