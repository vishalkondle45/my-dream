"use client";
import { Box } from "@mantine/core";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import { useEffect } from "react";

export default function RootLayout({ children }) {
  useEffect(() => {
    document.title = "Calendar";
  }, []);
  return <Box>{children}</Box>;
}
