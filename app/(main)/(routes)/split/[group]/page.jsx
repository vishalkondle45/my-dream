"use client";
import { api } from "@/convex/_generated/api";
import { getGroupIconByType } from "@/utils/constants";
import {
  ActionIcon,
  Group,
  Loader,
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
  IconPlus,
  IconReceipt,
  IconSettings,
  IconTrash,
} from "@tabler/icons-react";
import { useMutation, useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import Expenses from "../../_components/Expenses";
import GroupSettings from "../../_components/GroupSettings";
import Summary from "../../_components/Summary";
import AddExpense from "../../_components/AddExpense";

const Page = ({ params }) => {
  const group = useQuery(api.groups.getGroup, { group: params.group });
  const deleteGroup = useMutation(api.groups.deleteGroup);
  const user = useQuery(api.users.getCurrentUser);
  const users = useQuery(api.split.getUsers, { group: group?._id });
  const expenses = useQuery(api.expense.getExpenses, { group: group?._id });
  const splitAmong = useQuery(api.expense.getSplitAmong, { group: group?._id });
  const paidBy = useQuery(api.expense.getPaidBy, { group: group?._id });
  const router = useRouter();
  const [groupSettingsOpened, { open, close }] = useDisclosure(false);
  const [addExpenseOpened, addExpenseHandlers] = useDisclosure(false);

  const openGroupSettings = () =>
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

  if (!group || !user || !users || !expenses || !splitAmong || !paidBy) {
    <Loader />;
  }

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
          <Group gap={4}>
            <ActionIcon
              variant="subtle"
              radius="xl"
              onClick={addExpenseHandlers.open}
            >
              <IconPlus size={20} />
            </ActionIcon>
            <ActionIcon variant="subtle" radius="xl" onClick={open}>
              <IconSettings size={20} />
            </ActionIcon>
            <ActionIcon
              variant="subtle"
              radius="xl"
              color="red"
              onClick={openGroupSettings}
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
            <Expenses
              expenses={expenses}
              splitAmong={splitAmong}
              paidBy={paidBy}
              users={users}
              user={user}
            />
          </TabsPanel>
          <TabsPanel value="messages">{params.group}</TabsPanel>
          <TabsPanel value="settings">
            <Summary group={params.group} />
          </TabsPanel>
        </Tabs>
      </Stack>

      <Modal
        title="Group settings"
        opened={groupSettingsOpened}
        onClose={close}
      >
        <GroupSettings group={group} />
      </Modal>

      <Modal
        title="Add expense"
        opened={addExpenseOpened}
        onClose={addExpenseHandlers.close}
      >
        <AddExpense
          group={group}
          close={addExpenseHandlers.close}
          user={user}
          users={users}
        />
      </Modal>
    </>
  );
};

export default Page;
