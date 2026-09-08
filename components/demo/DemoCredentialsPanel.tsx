"use client";

/**
 * The demo's front door.
 *
 * A prospect is handed a URL and, historically, a paragraph of credentials to
 * type. Every character of that is a chance to fumble on a call, so the three
 * personas are one click each. The password is still shown, because a prospect
 * exploring on their own later needs it — and because a visible, working
 * credential is a small proof that the sign-in gate is real rather than painted.
 *
 * Deliberately styled from `authTokens` rather than invented values: this panel
 * has to read as part of the product's sign-in screen, not as a banner bolted on
 * top of it.
 */

import { Box, Typography } from "@mui/material";
import { Icon } from "@iconify/react";
import { DEMO_PASSWORD, DEMO_PERSONAS, type DemoPersona } from "@/lib/demo/config";
import {
  AUTH,
  EASE,
  FONT,
  RADIUS,
  TYPE,
  focusRing,
  hairlineRing,
  rtlSafeTracking,
} from "@/components/auth/layout/authTokens";

interface DemoCredentialsPanelProps {
  /** Fill the form with this persona and sign in. */
  onSelect: (persona: DemoPersona) => void;
  /** True while a sign-in is in flight — blocks double submissions. */
  busy?: boolean;
}

export function DemoCredentialsPanel({ onSelect, busy }: DemoCredentialsPanelProps) {
  return (
    <Box
      component="section"
      aria-label="Demo sign-in options"
      sx={{
        mb: 3,
        p: 2,
        borderRadius: `${RADIUS}px`,
        background: AUTH.violetSoft,
        boxShadow: hairlineRing("#e4d9ff"),
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
        <Icon icon="mdi:play-circle-outline" width={16} color={AUTH.violet} />
        <Typography
          sx={{
            ...TYPE.eyebrow,
            ...rtlSafeTracking,
            fontFamily: FONT,
            color: AUTH.violetDeep,
            textTransform: "uppercase",
          }}
        >
          Explore the demo
        </Typography>
      </Box>

      <Typography sx={{ ...TYPE.label, fontFamily: FONT, color: AUTH.inkMuted, mb: 1.5 }}>
        Pick a role to sign in instantly. Every module is switched on.
      </Typography>

      <Box sx={{ display: "grid", gap: 1 }}>
        {DEMO_PERSONAS.map((persona) => (
          <Box
            key={persona.key}
            component="button"
            type="button"
            disabled={busy}
            onClick={() => onSelect(persona)}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              width: "100%",
              // border-box, explicitly. A <button> does not pick up the app's
              // box-sizing reset, so `width: 100%` plus padding made every card
              // wider than the panel containing it and they spilled out of its
              // right edge.
              boxSizing: "border-box",
              // Without this a long blurb can push the flex item past its
              // container instead of ellipsing, which is the same overflow
              // arriving by a different route.
              minWidth: 0,
              textAlign: "start",
              p: 1.25,
              border: "none",
              cursor: busy ? "default" : "pointer",
              borderRadius: `${RADIUS}px`,
              background: AUTH.surface,
              boxShadow: hairlineRing("#e9deff"),
              transition: `box-shadow 160ms ${EASE}, transform 160ms ${EASE}`,
              opacity: busy ? 0.6 : 1,
              "&:hover": busy
                ? {}
                : { boxShadow: hairlineRing(AUTH.violet), transform: "translateY(-1px)" },
              "&:focus-visible": { outline: "none", boxShadow: focusRing(AUTH.violetSoft) },
            }}
          >
            <Box
              aria-hidden
              sx={{
                flexShrink: 0,
                width: 34,
                height: 34,
                display: "grid",
                placeItems: "center",
                borderRadius: `${RADIUS}px`,
                background: AUTH.violetSoft,
                color: AUTH.violet,
              }}
            >
              <Icon icon={persona.icon} width={19} />
            </Box>

            <Box sx={{ minWidth: 0, flexGrow: 1 }}>
              <Typography
                sx={{ ...TYPE.label, fontFamily: FONT, color: AUTH.ink, fontWeight: 600 }}
              >
                {persona.label}
              </Typography>
              <Typography
                sx={{
                  ...TYPE.eyebrow,
                  fontFamily: FONT,
                  color: AUTH.inkFaint,
                  letterSpacing: 0,
                  // Wrap to two lines rather than ellipsing on one. A single
                  // nowrap line truncated to "Courses, assessments, mock
                  // interviews, jobs…" in the narrow column, which hides the
                  // very list that tells a prospect what the role covers.
                  display: "-webkit-box",
                  WebkitBoxOrient: "vertical",
                  WebkitLineClamp: 2,
                  overflow: "hidden",
                }}
              >
                {persona.blurb}
              </Typography>
            </Box>

            <Icon
              icon="mdi:arrow-right"
              width={16}
              color={AUTH.violet}
              style={{ flexShrink: 0 }}
            />
          </Box>
        ))}
      </Box>

      <Typography
        sx={{
          ...TYPE.eyebrow,
          fontFamily: FONT,
          color: AUTH.inkFaint,
          letterSpacing: 0,
          mt: 1.5,
        }}
      >
        Or sign in manually - password{" "}
        <Box component="span" sx={{ fontWeight: 600, color: AUTH.inkMuted }}>
          {DEMO_PASSWORD}
        </Box>
      </Typography>
    </Box>
  );
}
