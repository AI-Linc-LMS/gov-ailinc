"use client";

import {
  Box,
  Paper,
  Typography,
  Button,
  Breadcrumbs,
  Link,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { QuizTimer } from "./QuizTimer";
import { QuizQuestionList } from "./QuizQuestionList";
import { QuestionTitle } from "./QuestionTitle";
import { AnswerOptionsList } from "./AnswerOptionsList";
import { ExplanationSection } from "./ExplanationSection";

export interface QuizQuestion {
  id: string | number;
  question: string;
  options: QuizOption[];
}

export interface QuizOption {
  id: string | number;
  label: string;
  value: string;
}

export interface QuizLayoutProps {
  // Breadcrumbs
  breadcrumbs?: Array<{ label: string; href?: string }>;

  // Current question
  currentQuestionIndex: number;
  currentQuestion: QuizQuestion;
  selectedAnswer?: string | number;

  // All questions
  questions: Array<{
    id: string | number;
    question: string;
    answered?: boolean;
  }>;
  totalQuestions: number;

  // Timer
  timeRemaining?: number; // in seconds
  totalDurationSeconds?: number; // total duration for progress circle
  onTimeUp?: () => void;

  // Actions
  onAnswerSelect: (answerId: string | number) => void;
  onNextQuestion?: () => void;
  onPreviousQuestion?: () => void;
  onFinalSubmit: () => void;
  onQuestionClick?: (questionId: string | number) => void;

  // UI state
  isSubmitting?: boolean;
  showCorrectAnswer?: boolean;
  correctAnswerId?: string | number;
  isReadOnly?: boolean; // For viewing past submissions
  explanation?: string; // Explanation for the current question
  /** When true (e.g. inside course submodule), show Submit Early in top bar only */
  isSubmodule?: boolean;
}

export function QuizLayout({
  breadcrumbs = [],
  currentQuestionIndex,
  currentQuestion,
  selectedAnswer,
  questions,
  totalQuestions,
  timeRemaining,
  totalDurationSeconds,
  onTimeUp,
  onAnswerSelect,
  onNextQuestion,
  onPreviousQuestion,
  onFinalSubmit,
  onQuestionClick,
  isSubmitting = false,
  showCorrectAnswer = false,
  correctAnswerId,
  isReadOnly = false,
  explanation,
  isSubmodule = false,
}: QuizLayoutProps) {
  const { t } = useTranslation("common");
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;
  const isFirstQuestion = currentQuestionIndex === 0;
  const answeredCount = questions.filter((q) => q.answered).length;
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        gap: { xs: 1.5, md: 2 },
        maxWidth: "100%",
        minHeight: 0,
        flex: 1,
      }}
    >
      {/* Left Sidebar - Timer and Question List */}
      <Box
        sx={{
          width: { xs: "100%", md: "300px" },
          flexShrink: 0,
          display: "flex",
          flexDirection: "column",
          gap: 1.5,
          order: { xs: 1, md: 0 },
        }}
      >
        {/* Timer */}
        {timeRemaining !== undefined && (
          <QuizTimer
            timeRemaining={timeRemaining}
            totalDurationSeconds={totalDurationSeconds}
            onTimeUp={onTimeUp}
          />
        )}

        {/* Question List */}
        <QuizQuestionList
          questions={questions}
          currentQuestionId={currentQuestion.id}
          onQuestionClick={onQuestionClick}
        />
      </Box>

      {/* Right Main Content */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
          minHeight: 0,
          order: { xs: 0, md: 1 },
        }}
      >
        {/* Breadcrumbs - hidden for submodule to free space for question/options */}
        {breadcrumbs.length > 0 && !isSubmodule && (
          <Breadcrumbs
            separator=">"
            sx={{
              mb: 3,
              "& .MuiBreadcrumbs-separator": {
                color: "#6b7280",
              },
            }}
          >
            {breadcrumbs.map((crumb, index) => {
              const isLast = index === breadcrumbs.length - 1;
              return isLast || !crumb.href ? (
                <Typography
                  key={index}
                  sx={{
                    color: isLast ? "#1a1f2e" : "#6b7280",
                    fontWeight: isLast ? 600 : 400,
                  }}
                >
                  {crumb.label}
                </Typography>
              ) : (
                <Link
                  key={index}
                  href={crumb.href}
                  sx={{
                    color: "#1b4f8a",
                    textDecoration: "none",
                    "&:hover": {
                      textDecoration: "underline",
                    },
                  }}
                >
                  {crumb.label}
                </Link>
              );
            })}
          </Breadcrumbs>
        )}

        {/* Question Card */}
        <Paper
          elevation={0}
          sx={{
            flex: 1,
            p: { xs: 2, sm: 3, md: 4 },
            backgroundColor: "#ffffff",
            borderRadius: 2,
            border: "1px solid #e5e7eb",
            display: "flex",
            flexDirection: "column",
            minHeight: 0,
          }}
        >
          {/* Question Title */}
          <QuestionTitle question={currentQuestion.question} compact={isSubmodule} />

          {/* Answer Options */}
          <AnswerOptionsList
            options={currentQuestion.options}
            selectedAnswer={selectedAnswer}
            showCorrectAnswer={showCorrectAnswer}
            correctAnswerId={correctAnswerId}
            isReadOnly={isReadOnly}
            isSubmitting={isSubmitting}
            onAnswerSelect={onAnswerSelect}
            compact={isSubmodule}
          />

          {/* Explanation */}
          {explanation && <ExplanationSection explanation={explanation} />}

          {/* Navigation and Submit Buttons */}
          <Box
            sx={{
              mt: 4,
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              justifyContent: "space-between",
              alignItems: { xs: "stretch", sm: "center" },
              gap: 2,
              flexShrink: 0,
            }}
          >
            {/* Progress indicator - mobile top */}
            <Box
              sx={{
                display: { xs: "block", sm: "none" },
                textAlign: "center",
                mb: { xs: isLastQuestion ? 0 : 1 },
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  color: "#6b7280",
                  fontWeight: 500,
                }}
              >
                {t("quiz.answeredOf", {
                  answered: answeredCount,
                  total: totalQuestions,
                })}
              </Typography>
            </Box>

            {/* Button Group */}
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                gap: 2,
                width: { xs: "100%", sm: "auto" },
                alignItems: { xs: "stretch", sm: "center" },
                justifyContent: "space-between",
              }}
            >
              {/* Previous Button */}
              <Button
                variant="outlined"
                onClick={onPreviousQuestion}
                disabled={isFirstQuestion || isSubmitting}
                sx={{
                  borderColor: "#1b4f8a",
                  color: "#1b4f8a",
                  px: { xs: 2, sm: 3 },
                  py: 1.5,
                  fontSize: "0.9375rem",
                  fontWeight: 600,
                  borderRadius: 2,
                  textTransform: "none",
                  flex: { xs: 1, sm: "none" },
                  minWidth: {
                    xs: "auto",
                    sm: "120px",
                  },
                  "&:hover": {
                    borderColor: "#12365f",
                    backgroundColor: "#1b4f8a15",
                  },
                  "&:disabled": {
                    borderColor: "#d1d5db",
                    color: "#9ca3af",
                  },
                }}
              >
                {t("quiz.previous")}
              </Button>

              {/* Progress indicator - desktop middle */}
              {!isLastQuestion && (
                <Box
                  sx={{
                    display: { xs: "none", sm: "flex" },
                    alignItems: "center",
                    minWidth: "150px",
                    justifyContent: "center",
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#6b7280",
                      fontWeight: 500,
                    }}
                  >
                    {t("quiz.answeredOf", {
                      answered: answeredCount,
                      total: totalQuestions,
                    })}
                  </Typography>
                </Box>
              )}

              {/* Next button - when not on last question (submodule + non-submodule) */}
              {!isLastQuestion && (
                <Button
                  variant="contained"
                  onClick={onNextQuestion}
                  disabled={isSubmitting}
                  sx={{
                    backgroundColor: "#1b4f8a",
                    color: "#ffffff",
                    px: { xs: 2, sm: 4 },
                    py: 1.5,
                    fontSize: "0.9375rem",
                    fontWeight: 600,
                    borderRadius: 2,
                    textTransform: "none",
                    flex: { xs: 1, sm: "none" },
                    minWidth: {
                      xs: "auto",
                      sm: "140px",
                    },
                    "&:hover": {
                      backgroundColor: "#12365f",
                    },
                    "&:disabled": {
                      backgroundColor: "#d1d5db",
                      color: "#9ca3af",
                    },
                  }}
                >
                  {t("quiz.next")}
                </Button>
              )}

              {/* Submit - only for non-submodule; submodule uses top bar Submit only */}
              {!isSubmodule && (
              <Button
                variant={isLastQuestion ? "contained" : "outlined"}
                onClick={onFinalSubmit}
                disabled={isSubmitting}
                sx={
                  isLastQuestion
                    ? {
                        background: isReadOnly
                          ? "linear-gradient(135deg, #1b4f8a 0%, #12365f 100%)"
                          : "linear-gradient(135deg, #0e7a3c 0%, #0B6232 100%)",
                        color: "#ffffff",
                        px: { xs: 3, sm: 5 },
                        py: 1.5,
                        fontSize: "0.9375rem",
                        fontWeight: 600,
                        borderRadius: 2,
                        textTransform: "none",
                        flex: 1,
                        minWidth: { xs: "auto", sm: "200px" },
                        boxShadow: "var(--shadow-sm)",
                        "&:hover": {
                          background: isReadOnly
                            ? "linear-gradient(135deg, #12365f 0%, #0e2a4b 100%)"
                            : "linear-gradient(135deg, #0B6232 0%, #0B6232 100%)",
                          boxShadow: "var(--shadow-md)",
                          transform: "translateY(-1px)",
                        },
                        "&:active": {
                          transform: "translateY(0)",
                        },
                        "&:disabled": {
                          background:
                            "linear-gradient(135deg, #d1d5db 0%, #9ca3af 100%)",
                          color: "#ffffff",
                          boxShadow: "none",
                          opacity: 0.6,
                        },
                        transition: "all 0.2s ease-in-out",
                      }
                    : {
                        borderColor: "#0e7a3c",
                        color: "#0B6232",
                        px: { xs: 2, sm: 3 },
                        py: 1.5,
                        fontSize: "0.9375rem",
                        fontWeight: 600,
                        borderRadius: 2,
                        textTransform: "none",
                        flex: { xs: 1, sm: "none" },
                        minWidth: { xs: "auto", sm: "140px" },
                        "&:hover": {
                          borderColor: "#0B6232",
                          backgroundColor: "#0B623215",
                        },
                        "&:disabled": {
                          borderColor: "#d1d5db",
                          color: "#9ca3af",
                        },
                      }
                }
              >
                {isReadOnly
                  ? t("quiz.back")
                  : isSubmitting
                    ? t("quiz.submitting")
                    : t("quiz.submitQuiz")}
              </Button>
              )}
            </Box>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}
