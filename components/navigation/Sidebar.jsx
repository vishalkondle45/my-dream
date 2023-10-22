"use client";
import { Box, rem } from "@mantine/core";
import SidebarItem from "./SidebarItem";

const Sidebar = ({ data }) => {
  return (
    <Box
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignSelf: "start",
      }}
      pr="xl"
      w={rem(200)}
    >
      {data.map((item) => (
        <SidebarItem icon={item.icon} text={item.text} route={item.route} />
      ))}
    </Box>
  );
};

export default Sidebar;