"use client";

import { Typography, ButtonBase, Box } from "@mui/material";
import { useTranslation } from "react-i18next";
import { IconWrapper } from "@/components/common/IconWrapper";

export function AdminLiveSessionsEmptyState({ onCreate }: { onCreate?: () => void }) {
  const { t } = useTranslation("common");
  return (
    <Box
      sx={{
        py: { xs: 5, md: 7 },
        px: 3,
        textAlign: "center",
        borderRadius: 4,
        border: "1px dashed color-mix(in srgb, var(--border-default) 90%, transparent)",
        bgcolor: "color-mix(in srgb, var(--card-bg) 60%, transparent)",
      }}
    >
      <Box
        sx={{
          width: 72,
          height: 72,
          borderRadius: 3,
          mx: "auto",
          mb: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #1b4f8a 0%, #0e2a4b 100%)",
          boxShadow: "var(--shadow-sm)",
        }}
      >
        <IconWrapper icon="mdi:video-plus-outline" size={36} color="#fff" />
      </Box>
      <Typography sx={{ color: "var(--font-primary)", fontWeight: 800, fontSize: "1.15rem", mb: 1 }}>
        {t("adminLiveSessions.emptyStateTitle")}
      </Typography>
      <Typography variant="body2" sx={{ color: "var(--font-secondary)", mb: 3, maxWidth: 460, mx: "auto" }}>
        {t("adminLiveSessions.emptyStateDesc")} {t("adminLiveSessions.emptyStateAction")}
      </Typography>
      {onCreate && (
        <ButtonBase
          onClick={onCreate}
          sx={{
            px: 3,
            py: 1.3,
            borderRadius: 999,
            fontWeight: 800,
            color: "white",
            display: "inline-flex",
            alignItems: "center",
            gap: 0.75,
            background: "linear-gradient(135deg, #1b4f8a 0%, #0e2a4b 100%)",
            boxShadow: "var(--shadow-sm)",
            "&:hover": { transform: "translateY(-1px)" },
            transition: "transform 120ms ease",
          }}
        >
          <IconWrapper icon="mdi:plus" size={18} color="#fff" />
          {t("adminLiveSessions.createLiveSession")}
        </ButtonBase>
      )}
    </Box>
  );
}
