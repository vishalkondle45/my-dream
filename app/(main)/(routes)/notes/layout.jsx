import Sidebar from "@/components/navigation/Sidebar";
import { Box, Group } from "@mantine/core";
import "@mantine/core/styles.css";
import { IconNote, IconTrash } from "@tabler/icons-react";

export const metadata = {
  title: "My Dream",
  description: "All tools in one application",
};

export default function RootLayout({ children }) {
  const sidebarData = [
    {
      icon: <IconNote size={18} />,
      text: "Notes",
      route: "/notes",
    },
    {
      icon: <IconTrash size={18} />,
      text: "Trash",
      route: "/notes/trash",
    },
  ];
  return (
    <Box style={{ display: "flex", flexDirection: "row" }}>
      <Sidebar data={sidebarData} />
      <Group style={{ flexGrow: 4 }} grow>
        {children}
      </Group>
    </Box>
  );
}
