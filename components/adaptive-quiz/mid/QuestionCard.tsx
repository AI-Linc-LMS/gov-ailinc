"use client";

import { Box, ButtonBase, Chip, Typography } from "@mui/material";
import { Icon } from "@iconify/react";
import { ConfidenceInput } from "./ConfidenceInput";
import RichHtml from "@/components/common/RichHtml";
import { prettySkill } from "@/lib/utils/skill-label.utils";
import type {
  AdaptiveQuestion,
  ConfidenceLevel,
} from "@/lib/types/adaptive-quiz";

interface QuestionCardProps {
  question: AdaptiveQuestion;
  /** 1-based - used in the "Q3 / 6" chip. */
  questionNumber: number;
  estimatedTotal: number;
  /** When the quiz length is a range (min≠max) the total is shown as "~N"; fixed-length quizzes
   *  (min==max, now the default) show the exact "N". */
  approxTotal?: boolean;
  selectedOption: string | null;
  onSelectOption: (id: string) => void;
  confidence: ConfidenceLevel | null;
  onConfidenceChange: (level: ConfidenceLevel) => void;
  confidencePromptEnabled: boolean;
  onSubmit: () => void;
  submitting: boolean;
  hintTokensRemaining: number;
  onAskHint: () => void;
  showHint: boolean;
}

function difficultyColor(label: string): string {
  switch (label) {
    case "Easy":
      return "#0e7a3c";
    case "Hard":
      return "#b32020";
    default:
      return "#1b4f8a";
  }
}

export function QuestionCard({
  question,
  questionNumber,
  estimatedTotal,
  approxTotal = true,
  selectedOption,
  onSelectOption,
  confidence,
  onConfidenceChange,
  confidencePromptEnabled,
  onSubmit,
  submitting,
  hintTokensRemaining,
  onAskHint,
  showHint,
}: QuestionCardProps) {
  const submitDisabled =
    !selectedOption ||
    (confidencePromptEnabled && confidence === null) ||
    submitting;

  return (
    <Box
      sx={{
        p: { xs: 2.5, md: 3.5 },
        borderRadius: 4,
        bgcolor: "var(--card-bg, #ffffff)",
        border: "1px solid var(--border-default, #e5e7eb)",
        boxShadow:
          "var(--shadow-sm)",
        display: "flex",
        flexDirection: "column",
        gap: 2.5,
      }}
    >
      {/* Header: question chip, difficulty, topic, hint CTA */}
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1, flexWrap: "wrap" }}>
        <Box sx={{ display: "flex", gap: 0.75, flexWrap: "wrap" }}>
          <Chip
            size="small"
            label={`Q${questionNumber} / ${approxTotal ? "~" : ""}${estimatedTotal}`}
            sx={{ fontWeight: 700, bgcolor: "color-mix(in srgb, #1b4f8a 12%, transparent)", color: "#1b4f8a" }}
          />
          <Chip
            size="small"
            label={question.difficulty_label}
            sx={{
              fontWeight: 700,
              bgcolor: `color-mix(in srgb, ${difficultyColor(question.difficulty_label)} 14%, transparent)`,
              color: difficultyColor(question.difficulty_label),
            }}
          />
          <Chip
            size="small"
            label={prettySkill(question.target_skill)}
            sx={{ fontWeight: 700, bgcolor: "color-mix(in srgb, currentColor 8%, transparent)" }}
          />
        </Box>
        <ButtonBase
          onClick={onAskHint}
          disabled={hintTokensRemaining <= 0 || showHint}
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: 0.5,
            px: 1.25,
            py: 0.6,
            borderRadius: 999,
            border: "1px dashed color-mix(in srgb, #1b4f8a 50%, transparent)",
            color: hintTokensRemaining > 0 ? "#1b4f8a" : "text.disabled",
            "&:disabled": { opacity: 0.6, cursor: "not-allowed" },
          }}
          aria-label="Ask for a hint"
        >
          <Icon icon="mdi:lightbulb-on-outline" width={16} />
          <Typography sx={{ fontSize: "0.72rem", fontWeight: 700 }}>
            Ask for a hint · {hintTokensRemaining} left
          </Typography>
        </ButtonBase>
      </Box>

      {/* Question text — rendered as HTML so <pre><code> code blocks / tables render correctly. */}
      <RichHtml
        html={question.question_text}
        sx={{
          fontSize: { xs: "1.05rem", md: "1.2rem" },
          fontWeight: 600,
          lineHeight: 1.45,
          color: "text.primary",
        }}
      />

      {/* Options */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1.25 }}>
        {question.options.map((opt) => {
          const selected = selectedOption === opt.id;
          return (
            <ButtonBase
              key={opt.id}
              onClick={() => onSelectOption(opt.id)}
              sx={{
                // `center` makes the row read evenly whether the option text
                // is one line or wraps to two - the badge tracks the text's
                // vertical centre, so all four rows look aligned in the grid.
                display: "flex",
                alignItems: "center",
                gap: 1.75,
                px: 2,
                py: 1.75,
                borderRadius: 3,
                textAlign: "left",
                width: "100%",
                minHeight: 64,
                border: selected
                  ? "1.5px solid #1b4f8a"
                  : "1.5px solid color-mix(in srgb, var(--border-default, #e5e7eb) 80%, transparent)",
                bgcolor: selected
                  ? "color-mix(in srgb, #1b4f8a 6%, transparent)"
                  : "var(--card-bg, #ffffff)",
                transition: "border-color 120ms ease, background-color 120ms ease",
              }}
            >
              <Box
                aria-hidden
                sx={{
                  width: 30,
                  height: 30,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 800,
                  fontSize: "0.85rem",
                  flexShrink: 0,
                  border: "1.5px solid",
                  borderColor: selected ? "#1b4f8a" : "color-mix(in srgb, currentColor 30%, transparent)",
                  color: selected ? "#1b4f8a" : "text.secondary",
                  bgcolor: selected ? "color-mix(in srgb, #1b4f8a 12%, transparent)" : "transparent",
                }}
              >
                {opt.id}
              </Box>
              <RichHtml
                html={opt.value}
                sx={{
                  flex: 1,
                  fontSize: "0.95rem",
                  fontWeight: 500,
                  color: "text.primary",
                  lineHeight: 1.5,
                }}
              />
            </ButtonBase>
          );
        })}
      </Box>

      {/* Confidence + Submit */}
      {confidencePromptEnabled && (
        <ConfidenceInput value={confidence} onChange={onConfidenceChange} />
      )}

      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <ButtonBase
          onClick={onSubmit}
          disabled={submitDisabled}
          sx={{
            px: 3,
            py: 1.4,
            borderRadius: 999,
            fontWeight: 800,
            color: "white",
            background: submitDisabled
              ? "color-mix(in srgb, #1b4f8a 35%, transparent)"
              : "linear-gradient(135deg, #1b4f8a 0%, #12365f 100%)",
            boxShadow: submitDisabled
              ? "none"
              : "var(--shadow-sm)",
            transition: "transform 120ms ease, box-shadow 120ms ease",
            "&:hover": { transform: submitDisabled ? "none" : "translateY(-1px)" },
            "&:disabled": { cursor: "not-allowed" },
            fontSize: "0.9rem",
            letterSpacing: "0.02em",
          }}
        >
          {submitting ? "Scoring…" : "Submit answer"}
        </ButtonBase>
      </Box>
    </Box>
  );
}
