"use client";
import { api } from "@/convex/_generated/api";
import { Box, Flex, LoadingOverlay } from "@mantine/core";
import "@mantine/core/styles.css";
import { useMediaQuery } from "@mantine/hooks";
import { useQuery } from "convex/react";
import { useEffect } from "react";
import SplitSidebar from "../_components/SplitSidebar";

export default function RootLayout({ children }) {
  let groups = useQuery(api.groups.get);
  const isMobile = useMediaQuery("(max-width: 600px)");

  useEffect(() => {
    document.title = "Split";
  }, []);

  if (!groups) {
    return <LoadingOverlay visible={!groups} />;
  }

  return (
    <Flex direction="row" align="baseline">
      {isMobile || <SplitSidebar />}
      <Box w="100%">{children}</Box>
    </Flex>
  );
}
