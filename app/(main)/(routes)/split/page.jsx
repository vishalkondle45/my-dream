"use client";
import { Tabs, TabsList, TabsPanel, TabsTab } from "@mantine/core";
import { IconChecklist, IconMoneybag, IconReceipt } from "@tabler/icons-react";
import Expenses from "../_components/Expenses";
import Summary from "../_components/Summary";

const Page = () => {
  return (
    <>
      <Tabs p={0} m={0} variant="default" defaultValue="gallery">
        <TabsList px={0} grow>
          <TabsTab
            px="sm"
            value="gallery"
            leftSection={<IconReceipt size={16} />}
          >
            Expenses
          </TabsTab>
          <TabsTab
            px="sm"
            value="messages"
            leftSection={<IconMoneybag size={16} />}
          >
            Balance
          </TabsTab>
          <TabsTab
            px="sm"
            value="summary"
            leftSection={<IconChecklist size={16} />}
          >
            Summary
          </TabsTab>
        </TabsList>
        <TabsPanel value="gallery">
          <Expenses />
        </TabsPanel>
        <TabsPanel value="messages">Messages tab content</TabsPanel>
        <TabsPanel value="summary">
          <Summary />
        </TabsPanel>
      </Tabs>
    </>
  );
};

export default Page;
