"use client";
import { api } from "@/convex/_generated/api";
import {
  ActionIcon,
  Burger,
  Center,
  Drawer,
  Group,
  Stack,
  Tabs,
  TabsList,
  TabsPanel,
  TabsTab,
  Text,
} from "@mantine/core";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import {
  IconChartPieFilled,
  IconPlus,
  IconSettings,
  IconTrash,
  IconUsersGroup,
} from "@tabler/icons-react";
import { useQuery } from "convex/react";
import { useEffect, useState } from "react";
import GrouItem from "../_components/GroupItem";
import SplitSidebar from "../_components/SplitSidebar";
import Analysis from "../_components/Analysis";

const Page = () => {
  const groups = useQuery(api.groups.get);
  const [opened, { toggle }] = useDisclosure(false);
  const isMobile = useMediaQuery("(max-width: 600px)");
  const [group, setGroup] = useState("");
  const getPaidBy = useQuery(api.expense.getPaidBy, { group: group });
  const getSplitAmong = useQuery(api.expense.getSplitAmong, { group: group });
  const users = useQuery(api.split.getUsers, { group: group });

  useEffect(() => {
    if (groups) {
      setGroup(groups[0]._id);
    }
  }, [groups]);

  return (
    <Center>
      <Stack gap={0}>
        <Group justify="space-between" mb="xs">
          <Group gap="xs">
            {isMobile && (
              <>
                <Drawer
                  size={"55%"}
                  opened={opened}
                  onClose={toggle}
                  withCloseButton={false}
                >
                  <SplitSidebar />
                </Drawer>
                <Burger
                  opened={opened}
                  onClick={toggle}
                  hiddenFrom="xs"
                  size="sm"
                />
              </>
            )}
            <Text fw="bold">Home</Text>
          </Group>
          <Group gap={4}>
            <ActionIcon variant="subtle" radius="xl">
              <IconPlus size={20} />
            </ActionIcon>
            <ActionIcon variant="subtle" radius="xl">
              <IconSettings size={20} />
            </ActionIcon>
            <ActionIcon variant="subtle" radius="xl" color="red">
              <IconTrash size={20} />
            </ActionIcon>
          </Group>
        </Group>
        <Tabs p={0} m={0} variant="pills" defaultValue="analysis">
          <TabsList px={0} grow>
            <TabsTab
              px="sm"
              value="groups"
              leftSection={<IconUsersGroup size={16} />}
            >
              Groups
            </TabsTab>
            <TabsTab
              px="sm"
              value="analysis"
              leftSection={<IconChartPieFilled size={16} />}
            >
              Analysis
            </TabsTab>
            <TabsTab
              px="sm"
              value="summary"
              leftSection={<IconChartPieFilled size={16} />}
            >
              Analysis
            </TabsTab>
          </TabsList>
          <TabsPanel value="groups">
            <Stack mt="xs" gap="sm">
              {groups?.map((group) => (
                <GrouItem group={group} />
              ))}
            </Stack>
          </TabsPanel>
          <TabsPanel value="analysis">
            <Analysis groups={groups} group={group} setGroup={setGroup} />
          </TabsPanel>
          <TabsPanel value="summary">Analysis</TabsPanel>
        </Tabs>
      </Stack>
    </Center>
  );
};

export default Page;
