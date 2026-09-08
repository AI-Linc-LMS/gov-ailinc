"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { Box, Button, Typography, Paper } from "@mui/material";
import { AlertCircle } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log the component stack in development.
    //
    // This swallowed everything, which meant a crash surfaced only as
    // "Something went wrong" with a one-line message and no way to tell WHICH
    // component threw. Debugging a render error then becomes a search of every
    // component on the route. React hands us the stack here; printing it in dev
    // costs nothing and turns that search into a single line.
    if (process.env.NODE_ENV !== "production") {
      console.error("[ErrorBoundary]", error?.message, "\n", errorInfo?.componentStack);
    }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="100vh"
          p={3}
        >
          <Paper sx={{ p: 4, maxWidth: 500, textAlign: "center" }}>
            <AlertCircle
              size={48}
              color="#d32f2f"
              style={{ marginBottom: 16 }}
            />
            <Typography variant="h5" gutterBottom>
              Something went wrong
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {this.state.error?.message || "An unexpected error occurred"}
            </Typography>
            <Button
              variant="contained"
              sx={{ textTransform: "none" }}
              size="small"
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
            >
              Reload Page
            </Button>
          </Paper>
        </Box>
      );
    }

    return this.props.children;
  }
}
