"use client";

import { Box, Stack, Typography } from "@mui/material";
import { Icon } from "@iconify/react";
import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "@/lib/services/dashboard.service";
import type { AtAGlanceContact } from "@/lib/types/dashboard";
import { PanelCard, SectionHeader } from "./parts";
import { GovPanelSkeleton } from "./govParts";

/**
 * The half dozen things an aspirant looks up constantly: the recruiting bodies'
 * own portals, the mission helpline, and the centre they belong to.
 *
 * A strip, not a column, and it runs the FULL width under both columns rather
 * than sitting inside one of them. Two reasons, and the second is the load
 * bearing one. Seven portal links and three contacts laid out in a narrow
 * column is a list of ten rows, which is not what "at a glance" means; across
 * the full width they are two rows a reader takes in at once. And the left
 * column had to end level with the right rail, which it does only if this panel
 * is outside the grid rather than stacked on top of the calendar and the
 * notices.
 *
 * The portal addresses are read off the job board's own apply links, which is
 * where the apply flow already sends a candidate, so the dashboard and the
 * posting can never carry two different addresses for one commission. That is
 * the whole reason a strip of links is safe to put on a government dashboard:
 * a portal link that has drifted is a candidate applying somewhere else.
 *
 * The contacts are not links. The helpline number is generated for this
 * preview, and a `tel:` on it would put somebody's phone on the line. The note
 * at the end says which of these are real and which are demo values, because an
 * officer reading this strip is entitled to know before they dial.
 */

const GLANCE_QUERY_KEY = ["gov-at-a-glance"] as const;

const CONTACT_ICON: Record<AtAGlanceContact["kind"], string> = {
  helpline: "mdi:phone-outline",
  centre: "mdi:map-marker-outline",
  email: "mdi:email-outline",
};

const SOURCE_NOTE =
  "Portal addresses are the recruiting bodies' own and open in a new tab. The helpline number and the centre details shown here are demo values for this preview.";

export function AtAGlancePanel() {
  const { data, isPending } = useQuery({
    queryKey: GLANCE_QUERY_KEY,
    queryFn: () => dashboardService.getAtAGlance(),
  });

  if (isPending) {
    return (
      <GovPanelSkeleton
        icon="mdi:link-variant"
        title="At a glance"
        subtitle="Official portals and mission contacts"
        rows={2}
      />
    );
  }

  // Both halves gone means there is nothing to look up, so the panel goes too.
  if (!data || (data.portals.length === 0 && data.contacts.length === 0)) return null;

  return (
    <PanelCard sx={{ mb: 0 }}>
      <SectionHeader
        icon="mdi:link-variant"
        title="At a glance"
        subtitle="Official portals and mission contacts"
      />

      {data.portals.length > 0 && (
        <Box
          sx={{
            display: "grid",
            // minmax(0, 1fr) rather than minmax(150px, 1fr): a grid track sized
            // to its content refuses to shrink below it, and that is what pushes
            // a page sideways on a 375px phone.
            gridTemplateColumns: {
              xs: "repeat(2, minmax(0,1fr))",
              sm: "repeat(4, minmax(0,1fr))",
              lg: "repeat(7, minmax(0,1fr))",
            },
            gap: 1,
          }}
        >
          {data.portals.map((portal) => (
            <Box
              key={portal.shortName}
              component="a"
              href={portal.url}
              target="_blank"
              rel="noopener noreferrer"
              title={portal.body}
              aria-label={`${portal.body}, opens in a new tab`}
              sx={{
                minWidth: 0,
                display: "block",
                px: 1,
                py: 0.85,
                borderRadius: 2,
                border: "1px solid #dde3eb",
                bgcolor: "#fff",
                textDecoration: "none",
                boxShadow: "var(--shadow-xs)",
                transition: "border-color 120ms ease, background-color 120ms ease",
                "&:hover": { borderColor: "#85aad6", bgcolor: "#f6f8fb" },
                "&:focus-visible": { outline: "none", boxShadow: "var(--ring-focus)", borderColor: "#4a7fbb" },
              }}
            >
              <Stack direction="row" spacing={0.35} alignItems="center" sx={{ minWidth: 0 }}>
                <Typography noWrap sx={{ fontSize: "0.76rem", fontWeight: 800, color: "#12365f", minWidth: 0 }}>
                  {portal.shortName}
                </Typography>
                <Icon icon="mdi:open-in-new" width={11} color="#6b7684" style={{ flexShrink: 0 }} />
              </Stack>
              <Typography noWrap sx={{ fontSize: "0.64rem", color: "#4a5563" }}>
                {portal.host}
              </Typography>
            </Box>
          ))}
        </Box>
      )}

      {data.contacts.length > 0 && (
        <Box
          sx={{
            mt: data.portals.length > 0 ? 1.5 : 0,
            pt: data.portals.length > 0 ? 1.5 : 0,
            borderTop: data.portals.length > 0 ? "1px solid #eef1f5" : "none",
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "repeat(3, minmax(0,1fr))" },
            gap: { xs: 1.25, sm: 2 },
          }}
        >
          {data.contacts.map((contact) => (
            <Stack key={contact.kind} direction="row" spacing={1.15} alignItems="flex-start" sx={{ minWidth: 0 }}>
              <Box
                sx={{
                  width: 30,
                  height: 30,
                  borderRadius: 2,
                  flexShrink: 0,
                  display: "grid",
                  placeItems: "center",
                  color: "#12365f",
                  bgcolor: "#eef3fa",
                  mt: 0.15,
                }}
              >
                <Icon icon={CONTACT_ICON[contact.kind] ?? "mdi:information-outline"} width={16} />
              </Box>
              <Box sx={{ minWidth: 0, flex: 1 }}>
                <Typography sx={{ fontSize: "0.59rem", fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", color: "#6b7684" }}>
                  {contact.label}
                </Typography>
                <Typography sx={{ fontSize: "0.84rem", fontWeight: 700, color: "#111a26", wordBreak: "break-word", lineHeight: 1.35 }}>
                  {contact.value}
                </Typography>
                <Typography sx={{ fontSize: "0.69rem", color: "#4a5563" }}>{contact.sub}</Typography>
              </Box>
            </Stack>
          ))}
        </Box>
      )}

      <Stack direction="row" spacing={0.7} alignItems="flex-start" sx={{ mt: 1.5, pt: 1.25, borderTop: "1px solid #eef1f5" }}>
        <Icon icon="mdi:information-outline" width={14} color="#6b7684" style={{ flexShrink: 0, marginTop: 2 }} />
        <Typography sx={{ fontSize: "0.69rem", lineHeight: 1.5, color: "#4a5563" }}>{SOURCE_NOTE}</Typography>
      </Stack>
    </PanelCard>
  );
}
