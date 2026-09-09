"use client";

import { Box, Typography, Paper } from "@mui/material";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

interface MiniPieChartProps {
  title: string;
  data: Array<{ name: string; value: number; color: string }>;
  height?: number;
}

export function MiniPieChart({
  title,
  data,
  height = 180,
}: MiniPieChartProps) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        borderRadius: 2,
        border: "1px solid rgba(0,0,0,0.08)",
        backgroundColor: "#ffffff",
        boxShadow: "var(--shadow-xs)",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Typography
        variant="body2"
        sx={{
          color: "#666666",
          fontSize: "0.875rem",
          mb: 1.5,
          fontWeight: 600,
        }}
      >
        {title}
      </Typography>
      <Box sx={{ flex: 1, minHeight: 0 }}>
        <ResponsiveContainer width="100%" height={height}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`}
              outerRadius={height * 0.35}
              // No `fill` here on purpose. Every slice sets its own via <Cell>, so
              // the only thing a fill on <Pie> did was leave Recharts' stock violet
              // in the file for a case that cannot render: an empty `data` draws no
              // slices at all. Removed rather than recoloured.
              dataKey="value"
              animationBegin={0}
              animationDuration={1000}
              animationEasing="ease-out"
              isAnimationActive={true}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "#ffffff",
                border: "1px solid rgba(0,0,0,0.08)",
                borderRadius: "6px",
                padding: "4px 8px",
                fontSize: "0.75rem",
              }}
            />
            <Legend
              wrapperStyle={{ fontSize: "0.75rem" }}
              iconType="circle"
              formatter={(value) => (
                <span style={{ color: "#666666", fontSize: "0.75rem" }}>{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
}
