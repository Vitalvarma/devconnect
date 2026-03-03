"use client";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { ReactNode, useMemo, useState } from "react";
import { getDesignTokens } from "@/components/theme";

type Mode = "light" | "dark";

export default function CustomThemeProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [mode] = useState<Mode>("light");

  const theme = useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}

