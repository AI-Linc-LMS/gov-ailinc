"use client";

import { Paper, Typography, Box } from "@mui/material";
import { IconWrapper } from "@/components/common/IconWrapper";
import { memo } from "react";

interface OverallFeedbackProps {
  areas_for_improvement: string[];
  overall_feedback: string;
}

const OverallFeedbackComponent = ({
  areas_for_improvement,
  overall_feedback,
}: OverallFeedbackProps) => {
  // Defense-in-depth: the parent already defaults these, but guard here too so a partial
  // evaluation payload can never crash the result page on .length / .map.
  const areas = Array.isArray(areas_for_improvement) ? areas_for_improvement : [];
  const feedback = overall_feedback || "No overall feedback available.";
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
        gap: 3,
      }}
    >
      {/* Areas for Improvement */}
      {areas.length > 0 && (
        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: 3,
            border: "1px solid #e5e7eb",
            background: "linear-gradient(135deg, #fdf3e2 0%, #f0ddb8 100%)",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 2,
                background: "linear-gradient(135deg, #b7791f 0%, #8a5a12 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <IconWrapper icon="mdi:lightbulb-on" size={22} color="#ffffff" />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 700, color: "#78350f" }}>
              Areas for Improvement
            </Typography>
          </Box>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            {areas.map((area, idx) => (
              <Box
                key={idx}
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 1.5,
                  p: 2,
                  backgroundColor: "#ffffff",
                  borderRadius: 2,
                  border: "1px solid #fed7aa",
                }}
              >
                <Box
                  sx={{
                    minWidth: 24,
                    height: 24,
                    borderRadius: "50%",
                    backgroundColor: "#b7791f",
                    color: "#ffffff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                  }}
                >
                  {idx + 1}
                </Box>
                <Typography variant="body2" sx={{ color: "#78350f", flex: 1 }}>
                  {area}
                </Typography>
              </Box>
            ))}
          </Box>
        </Paper>
      )}

      {/* Overall Feedback */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 3,
          border: "1px solid #e5e7eb",
          background: "linear-gradient(135deg, #d9e6f4 0%, #b6cde8 100%)",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 2,
              background: "linear-gradient(135deg, #4a7fbb 0%, #1b4f8a 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <IconWrapper icon="mdi:message-text" size={22} color="#ffffff" />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 700, color: "#12365f" }}>
            Overall Feedback
          </Typography>
        </Box>
        <Paper
          elevation={0}
          sx={{
            p: 3,
            backgroundColor: "#ffffff",
            borderRadius: 2,
            border: "1px solid #b6cde8",
          }}
        >
          <Typography variant="body2" sx={{ color: "#12365f", lineHeight: 1.8 }}>
            {feedback}
          </Typography>
        </Paper>
      </Paper>
    </Box>
  );
};

export const OverallFeedback = memo(OverallFeedbackComponent);
OverallFeedback.displayName = "OverallFeedback";

