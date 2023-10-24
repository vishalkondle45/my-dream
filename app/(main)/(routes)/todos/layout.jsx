"use client";
import Sidebar from "@/components/navigation/Sidebar";
import { api } from "@/convex/_generated/api";
import { Box, Group, LoadingOverlay } from "@mantine/core";
import "@mantine/core/styles.css";
import {
  IconCalendarEvent,
  IconHome,
  IconStar,
  IconSun,
} from "@tabler/icons-react";
import { useQuery } from "convex/react";

export default function RootLayout({ children }) {
  let notes = useQuery(api.notes.get);

  const sidebarData = [
    {
      icon: <IconHome size={18} />,
      text: "Todos",
      route: "/todos",
    },
    {
      icon: <IconSun size={18} />,
      text: "My Day",
      route: "/todos/myday",
    },
    {
      icon: <IconStar size={18} />,
      text: "Important",
      route: "/todos/important",
    },
    {
      icon: <IconCalendarEvent size={18} />,
      text: "Planned",
      route: "/todos/planned",
    },
  ];

  if (!notes) {
    return (
      <LoadingOverlay
        visible={true}
        zIndex={1000}
        overlayProps={{ radius: "sm", blur: 2 }}
      />
    );
  }

  return (
    <Box style={{ display: "flex", flexDirection: "row" }}>
      <Sidebar data={sidebarData} />
      <Group style={{ flexGrow: 4, alignItems: "baseline" }} grow>
        {children}
      </Group>
    </Box>
  );
}
