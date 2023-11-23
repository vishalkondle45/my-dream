"use client";
import { api } from "@/convex/_generated/api";
import { getGroupIconByType } from "@/utils/constants";
import {
  ActionIcon,
  Group,
  Modal,
  Stack,
  Tabs,
  TabsList,
  TabsPanel,
  TabsTab,
  Text,
  ThemeIcon,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import {
  IconChecklist,
  IconMoneybag,
  IconReceipt,
  IconSettings,
  IconTrash,
} from "@tabler/icons-react";
import { useMutation, useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import Expenses from "../../_components/Expenses";
import GroupSettings from "../../_components/GroupSettings";
import Summary from "../../_components/Summary";

const Page = ({ params }) => {
  const group = useQuery(api.groups.getGroup, { group: params.group });
  const deleteGroup = useMutation(api.groups.deleteGroup);
  const router = useRouter();
  const [opened, { open, close }] = useDisclosure(false);

  const openModal = () =>
    modals.openConfirmModal({
      title: "Delete group",
      children: <Text size="sm">Press confirm to delete this group.</Text>,
      labels: { confirm: "Confirm", cancel: "Cancel" },
      onConfirm: () => {
        deleteGroup({ group: group?._id }).then(() => {
          router.push("/split");
        });
      },
      size: "xs",
    });

  return (
    <>
      <Stack gap={0}>
        <Group justify="space-between">
          <Group gap="xs">
            <ThemeIcon size="sm" variant="transparent">
              {getGroupIconByType(group?.type)}
            </ThemeIcon>
            <Text fw="bold">{group?.name}</Text>
          </Group>
          <Group gap="xs">
            <ActionIcon variant="subtle" radius="xl" onClick={open}>
              <IconSettings size={20} />
            </ActionIcon>
            <ActionIcon
              variant="subtle"
              radius="xl"
              color="red"
              onClick={openModal}
            >
              <IconTrash size={20} />
            </ActionIcon>
          </Group>
        </Group>
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
              value="settings"
              leftSection={<IconChecklist size={16} />}
            >
              Summary
            </TabsTab>
          </TabsList>
          <TabsPanel value="gallery">
            <Expenses />
          </TabsPanel>
          <TabsPanel value="messages">{params.group}</TabsPanel>
          <TabsPanel value="settings">
            <Summary group={params.group} />
          </TabsPanel>
        </Tabs>
      </Stack>

      <Modal title="Group settings" opened={opened} onClose={close}>
        <GroupSettings group={group} />
      </Modal>
    </>
  );
};

export default Page;
