"use client";
import { Box } from "@mantine/core";
import { useEffect } from "react";

export default function RootLayout({ children }) {
  useEffect(() => {
    document.title = "Weather";
  }, []);
  return <Box>{children}</Box>;
}
