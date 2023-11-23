"use client";
import LandingPageNavbar from "@/app/(marketing)/_components/Navbar";
import { Box } from "@mantine/core";
import "@mantine/core/styles.css";
import useStoreUserEffect from "./_hooks/useStoreUserEffect";

export default function RootLayout({ children }) {
  const userId = useStoreUserEffect();
  return (
    <Box>
      <LandingPageNavbar />
      <Box px="md">{children}</Box>
    </Box>
  );
}
