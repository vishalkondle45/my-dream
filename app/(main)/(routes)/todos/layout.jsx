"use client";
import { api } from "@/convex/_generated/api";
import { sidebarData } from "@/utils/constants";
import { Box, Center, Group, Loader } from "@mantine/core";
import "@mantine/core/styles.css";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { IconList } from "@tabler/icons-react";
import { useQuery } from "convex/react";
import TodoSidebar from "../_components/TodoSidebar";

export default function RootLayout({ children }) {
  let lists = useQuery(api.lists.get);
  const [opened, { toggle }] = useDisclosure(false);
  const isMobile = useMediaQuery("(max-width: 600px)");

  if (!lists) {
    return (
      <Center>
        <Loader type="bars" />
      </Center>
    );
  }

  if (lists) {
    lists?.forEach((list) => {
      if (!sidebarData.some((item) => item.route == `/todos/${list?._id}`)) {
        sidebarData.push({
          icon: <IconList size={18} />,
          text: list?.title,
          route: `/todos/${list?._id}`,
        });
      }
    });
  }

  return (
    <Box style={{ display: "flex", flexDirection: "row" }}>
      {isMobile || <TodoSidebar data={sidebarData} />}
      <Group style={{ flexGrow: 4, alignItems: "baseline" }} grow>
        {children}
      </Group>
    </Box>
  );
}
