"use client";
import { api } from "@/convex/_generated/api";
import { sidebarDataTodos } from "@/utils/constants";
import { Box, Center, Group, Loader } from "@mantine/core";
import "@mantine/core/styles.css";
import { useMediaQuery } from "@mantine/hooks";
import { IconList } from "@tabler/icons-react";
import { useQuery } from "convex/react";
import TodoSidebar from "../_components/TodoSidebar";
import { useEffect } from "react";

export default function RootLayout({ children }) {
  let lists = useQuery(api.lists.get);
  const isMobile = useMediaQuery("(max-width: 600px)");

  useEffect(() => {
    document.title = "Todos";
  }, []);

  if (!lists) {
    return (
      <Center>
        <Loader />
      </Center>
    );
  }

  let data = [...sidebarDataTodos];
  if (lists) {
    lists?.forEach((list) => {
      let i = sidebarDataTodos.findIndex(
        (o) => o.route == `/todos/${list?._id}`
      );
      if (i > -1) {
        sidebarDataTodos[i].text = list.title;
      } else {
        data.push({
          icon: <IconList size={18} />,
          text: list?.title,
          route: `/todos/${list?._id}`,
        });
      }
    });
  }

  return (
    <Box style={{ display: "flex", flexDirection: "row" }}>
      {isMobile || <TodoSidebar data={data} />}
      <Group style={{ flexGrow: 4, alignItems: "baseline" }} grow>
        {children}
      </Group>
    </Box>
  );
}
