"use client";

import { Box, Typography } from "@mui/material";
import { normalizeEncoding } from "@/lib/utils/text-utils";

interface ExplanationSectionProps {
  explanation: string;
}

export function ExplanationSection({ explanation }: ExplanationSectionProps) {
  const normalized = normalizeEncoding(explanation);
  return (
    <Box
      sx={{
        mt: 3,
        p: 2.5,
        backgroundColor: "#f9fafb",
        borderRadius: 2,
        borderLeft: "4px solid #1b4f8a",
      }}
    >
      <Typography
        variant="body2"
        sx={{
          fontWeight: 600,
          color: "#1b4f8a",
          mb: 1,
        }}
      >
        Explanation:
      </Typography>
      <Typography
        variant="body2"
        sx={{
          color: "#4b5563",
          lineHeight: 1.6,
        }}
      >
        {normalized}
      </Typography>
    </Box>
  );
}

