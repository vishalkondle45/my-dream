"use client";
import LandingPageNavbar from "@/app/(marketing)/_components/Navbar";
import { Box } from "@mantine/core";
import "@mantine/core/styles.css";

export default function RootLayout({ children }) {
  return (
    <Box>
      <LandingPageNavbar />
      <Box px="md">{children}</Box>
    </Box>
  );
}
