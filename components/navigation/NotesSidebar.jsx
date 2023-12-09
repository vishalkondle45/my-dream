"use client";
import { Box, rem } from "@mantine/core";
import SidebarItem from "./SidebarItem";
import { useMediaQuery } from "@mantine/hooks";

const NotesSidebar = ({ data }) => {
  const isMobile = useMediaQuery("(max-width: 600px)");

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
        <SidebarItem
          icon={item?.icon}
          text={item?.text}
          route={item?.route}
          key={item?.route}
        />
      ))}
    </Box>
  );
};

export default NotesSidebar;
