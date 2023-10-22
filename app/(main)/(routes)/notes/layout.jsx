import Sidebar from "@/components/navigation/Sidebar";
import { Box, Group } from "@mantine/core";
import "@mantine/core/styles.css";
import { IconNote, IconSettings, IconTrash } from "@tabler/icons-react";

export const metadata = {
  title: "My Dream",
  description: "All tools in one application",
};

export default function RootLayout({ children }) {
  const sidebarData = [
    {
      icon: <IconNote />,
      text: "Notes",
      route: "/notes",
    },
    {
      icon: <IconTrash />,
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
