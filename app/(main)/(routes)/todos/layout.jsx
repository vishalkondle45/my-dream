"use client";
import { api } from "@/convex/_generated/api";
import { Box, Center, Group, Loader } from "@mantine/core";
import "@mantine/core/styles.css";
import {
  IconCalendarEvent,
  IconHome,
  IconList,
  IconStar,
  IconSun,
} from "@tabler/icons-react";
import { useQuery } from "convex/react";
import TodoSidebar from "../_components/TodoSidebar";

export default function RootLayout({ children }) {
  let lists = useQuery(api.lists.get);

  if (!lists) {
    return (
      <Center>
        <Loader type="bars" />
      </Center>
    );
  }

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

  if (lists) {
    lists?.forEach((list) => {
      sidebarData.push({
        icon: <IconList size={18} />,
        text: list?.title,
        route: `/todos/${list?._id}`,
      });
    });
  }
  return (
    <Box style={{ display: "flex", flexDirection: "row" }}>
      <TodoSidebar data={sidebarData} />
      <Group style={{ flexGrow: 4, alignItems: "baseline" }} grow>
        {children}
      </Group>
    </Box>
  );
}
