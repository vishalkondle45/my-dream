"use client";
import NotesSidebar from "@/components/navigation/NotesSidebar";
import { sidebarDataNotes } from "@/utils/constants";
import { Box, Group } from "@mantine/core";
import "@mantine/core/styles.css";
import { useMediaQuery } from "@mantine/hooks";
import { useEffect } from "react";

export default function RootLayout({ children }) {
  useEffect(() => {
    document.title = "Notes";
  }, []);
  const isMobile = useMediaQuery("(max-width: 600px)");
  return (
    <Box style={{ display: "flex", flexDirection: "row" }}>
      {isMobile || <NotesSidebar data={sidebarDataNotes} />}
      <Group style={{ flexGrow: 4 }} grow>
        {children}
      </Group>
    </Box>
  );
}
