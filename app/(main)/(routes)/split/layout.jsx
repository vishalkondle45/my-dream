"use client";
import { api } from "@/convex/_generated/api";
import { sidebarDataSplit } from "@/utils/constants";
import { Box, Center, Flex, Group, Loader } from "@mantine/core";
import "@mantine/core/styles.css";
import { useMediaQuery } from "@mantine/hooks";
import { IconList } from "@tabler/icons-react";
import { useQuery } from "convex/react";
import { useEffect } from "react";
import SplitSidebar from "../_components/SplitSidebar";

export default function RootLayout({ children }) {
  let lists = useQuery(api.lists.get);
  const isMobile = useMediaQuery("(max-width: 600px)");

  useEffect(() => {
    document.title = "Split";
  }, []);

  if (!lists) {
    return (
      <Center>
        <Loader size="xl" />
      </Center>
    );
  }

  let data = [...sidebarDataSplit];
  if (lists) {
    lists?.forEach((list) => {
      let i = sidebarDataSplit.findIndex(
        (o) => o.route == `/split/${list?._id}`
      );
      if (i > -1) {
        sidebarDataSplit[i].text = list.title;
      } else {
        data.push({
          icon: <IconList size={18} />,
          text: list?.title,
          route: `/split/${list?._id}`,
        });
      }
    });
  }

  return (
    <Flex direction="row" align="baseline">
      {isMobile || <SplitSidebar data={data} />}
      <Box w="100%">
        <Center>{children}</Center>
      </Box>
    </Flex>
  );
}
