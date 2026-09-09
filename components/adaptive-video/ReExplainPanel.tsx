"use client";

import { Box, Button, Typography, CircularProgress } from "@mui/material";
import { Icon } from "@iconify/react";
import { useState } from "react";
import { AIPill } from "@/components/adaptive-quiz/shared/AIPill";
import { CompanionCard } from "./CompanionCard";
import type { ReExplainResult, ReExplainStyle } from "@/lib/services/adaptive-video.service";

interface Props {
  /** Re-explain the last ~30s ending at the player's current time. */
  onReExplain: (style: ReExplainStyle) => Promise<ReExplainResult>;
}

const STYLES: { key: ReExplainStyle; label: string; icon: string }[] = [
  { key: "plain", label: "Plain English", icon: "mdi:translate" },
  { key: "analogy", label: "Analogies", icon: "mdi:lightbulb-on-outline" },
  { key: "code", label: "Code", icon: "mdi:code-tags" },
  { key: "formal", label: "Formal", icon: "mdi:script-text-outline" },
];

/**
 * "Feeling lost?" - the headline rescue (spec §3.4b). Re-narrates the last 30s in
 * the chosen register without losing the student's place.
 */
export function ReExplainPanel({ onReExplain }: Props) {
  const [loading, setLoading] = useState<ReExplainStyle | null>(null);
  const [result, setResult] = useState<ReExplainResult | null>(null);

  const run = async (style: ReExplainStyle) => {
    setLoading(style);
    try {
      setResult(await onReExplain(style));
    } catch {
      setResult(null);
    } finally {
      setLoading(null);
    }
  };

  return (
    <CompanionCard accent="#0f6b7a" title="Feeling lost?" icon="mdi:lifebuoy">
      <Button
        fullWidth
        variant="contained"
        startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <Icon icon="mdi:sparkles" />}
        disabled={!!loading}
        onClick={() => run("formal")}
        sx={{
          textTransform: "none",
          fontWeight: 800,
          fontSize: "0.92rem",
          borderRadius: 2.5,
          py: 1.25,
          background: "linear-gradient(135deg, #1b4f8a 0%, #1b4f8a 55%, #0f6b7a 100%)",
          boxShadow: "var(--shadow-sm)",
          "&:hover": { transform: "translateY(-1px)", boxShadow: "var(--shadow-md)" },
          transition: "all 140ms ease",
        }}
      >
        {loading ? "Re-narrating…" : "Re-explain this clip"}
      </Button>
      <Typography sx={{ fontSize: "0.76rem", color: "text.secondary", mt: 1.25, mb: 1.25, lineHeight: 1.5 }}>
        We&apos;ll re-narrate the last 30s in your chosen style.
      </Typography>
      <Box sx={{ display: "flex", gap: 0.75 }}>
        {STYLES.map((s) => (
          <Button
            key={s.key}
            size="small"
            variant="outlined"
            disabled={!!loading}
            startIcon={<Icon icon={s.icon} width={14} />}
            onClick={() => run(s.key)}
            sx={{
              textTransform: "none", borderRadius: 999, flex: 1, fontSize: "0.74rem", fontWeight: 700,
              borderColor: "color-mix(in srgb, #1b4f8a 30%, transparent)", color: "text.primary",
              "& .MuiButton-startIcon": { mr: 0.4 },
              "&:hover": { borderColor: "#1b4f8a", background: "color-mix(in srgb, #1b4f8a 8%, transparent)" },
            }}
          >
            {s.label}
          </Button>
        ))}
      </Box>
      {result && (
        <Box sx={{ mt: 1.75, p: 1.75, borderRadius: 2.5, position: "relative", overflow: "hidden",
          background: "color-mix(in srgb, #1b4f8a 8%, transparent)",
          border: "1px solid color-mix(in srgb, #1b4f8a 20%, transparent)" }}>
          <Box sx={{ display: "flex", gap: 1, mb: 0.75, alignItems: "center" }}>
            <AIPill icon={<Icon icon="mdi:sparkles" />}>{result.style}</AIPill>
            {result.cached && (
              <Typography sx={{ fontSize: "0.64rem", color: "text.secondary", alignSelf: "center" }}>instant · cached</Typography>
            )}
          </Box>
          <Typography sx={{ fontSize: "0.87rem", whiteSpace: "pre-wrap", lineHeight: 1.55 }}>{result.content}</Typography>
        </Box>
      )}
    </CompanionCard>
  );
}
