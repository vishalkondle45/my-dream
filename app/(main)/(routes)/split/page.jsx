"use client";
import { api } from "@/convex/_generated/api";
import {
  Burger,
  Center,
  Drawer,
  Group,
  LoadingOverlay,
  Stack,
  Tabs,
  TabsList,
  TabsPanel,
  TabsTab,
  Text,
  Title,
} from "@mantine/core";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { IconChartPieFilled, IconUsersGroup } from "@tabler/icons-react";
import { useQuery } from "convex/react";
import { useEffect, useState } from "react";
import Analysis from "../_components/Analysis";
import GrouItem from "../_components/GroupItem";
import SplitSidebar from "../_components/SplitSidebar";

const Page = () => {
  const groups = useQuery(api.groups.get);
  const [opened, { toggle }] = useDisclosure(false);
  const isMobile = useMediaQuery("(max-width: 600px)");
  const [group, setGroup] = useState("");

  useEffect(() => {
    if (groups) {
      setGroup(groups[0]?._id);
    }
  }, [groups]);

  if (!groups) {
    return <LoadingOverlay />;
  }

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
            {groups.length && <Text fw="bold">Home</Text>}
          </Group>
        </Group>
        {groups.length ? (
          <Tabs mx="xs" p={0} m={0} variant="pills" defaultValue="analysis">
            <TabsList px={0} grow>
              <TabsTab
                px="sm"
                value="groups"
                leftSection={<IconUsersGroup size={16} />}
              >
                Groups &nbsp;
              </TabsTab>
              <TabsTab
                px="sm"
                value="analysis"
                leftSection={<IconChartPieFilled size={16} />}
              >
                Analysis &nbsp;
              </TabsTab>
              <TabsTab
                px="sm"
                value="todo"
                leftSection={<IconChartPieFilled size={16} />}
              >
                Todo &nbsp;
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
            <TabsPanel value="todo">Todo</TabsPanel>
          </Tabs>
        ) : (
          <Stack w="100%">
            <Title mx="lg" order={1} fw={900} ff="sans-serif">
              No Groups Found
            </Title>
            <Text ta="center" c="gray">
              Please create group from sidebar...
            </Text>
          </Stack>
        )}
      </Stack>
    </Center>
  );
};

export default Page;
