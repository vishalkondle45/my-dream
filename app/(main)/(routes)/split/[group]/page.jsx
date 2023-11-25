"use client";
import { api } from "@/convex/_generated/api";
import { colors, getGroupIconByType } from "@/utils/constants";
import { getInitials, sumAscii } from "@/utils/functions";
import {
  ActionIcon,
  Avatar,
  Divider,
  Group,
  Loader,
  Modal,
  NumberFormatter,
  Paper,
  ScrollArea,
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
  IconPencil,
  IconPlus,
  IconReceipt,
  IconSettings,
  IconShare,
  IconTrash,
  IconTrashFilled,
} from "@tabler/icons-react";
import { useMutation, useQuery } from "convex/react";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { useState } from "react";
import AddExpense from "../../_components/AddExpense";
import Expenses from "../../_components/Expenses";
import GroupSettings from "../../_components/GroupSettings";
import Summary from "../../_components/Summary";

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
  const [editExpenseOpened, editExpenseHandlers] = useDisclosure(false);
  const [selectedExpense, setSelectedExpense] = useState(null);

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
      {!group || !user || !users || !expenses || !splitAmong || !paidBy ? (
        <Loader />
      ) : (
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
                  setSelectedExpense={setSelectedExpense}
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

          <Modal
            withCloseButton={false}
            opened={Boolean(selectedExpense?._id)}
            onClose={() => setSelectedExpense(null)}
            scrollAreaComponent={ScrollArea.Autosize}
          >
            <Paper shadow="xl" withBorder px="md" py="xs">
              <Group gap="xs" justify="space-between" wrap="nowrap">
                <Group gap="xs" wrap="nowrap">
                  <ThemeIcon variant="filled" size="lg">
                    <IconReceipt size={22} />
                  </ThemeIcon>
                  <Stack gap={0}>
                    <Text size="sm" fw={500}>
                      {selectedExpense?.description}
                    </Text>
                    <Text size="sm" fw={300}>
                      {dayjs(selectedExpense?.date).format("DD MMM YYYY")}
                    </Text>
                    <NumberFormatter
                      allowNegative={false}
                      value={selectedExpense?.amount}
                      prefix="₹ "
                      thousandsGroupStyle="lakh"
                      thousandSeparator
                      size="sm"
                      fw={500}
                    />
                  </Stack>
                </Group>
                <Group gap="xs" justify="right" wrap="nowrap">
                  <ActionIcon variant="light">
                    <IconPencil size={16} />
                  </ActionIcon>
                  <ActionIcon variant="light">
                    <IconTrashFilled size={16} />
                  </ActionIcon>
                  <ActionIcon variant="light">
                    <IconShare size={16} />
                  </ActionIcon>
                </Group>
              </Group>
            </Paper>
            <Paper shadow="xl" mt="md" p="sm" withBorder>
              <Text mb="xs" fw="bolder">
                Paid By
              </Text>
              {paidBy
                ?.filter((item) => item.expense === selectedExpense?._id)
                ?.map((item) => (
                  <Group mb="xs" key={item._id} justify="space-between">
                    <Group gap="xs">
                      <Avatar
                        size="sm"
                        color={
                          colors[
                            sumAscii(
                              users.find((user) => user.userId === item?.user)
                                .name
                            ) - 1
                          ]
                        }
                      >
                        {getInitials(
                          users.find((user) => user.userId === item?.user).name
                        )}
                      </Avatar>
                      <Text>
                        {users.find((user) => user.userId === item?.user).name}
                      </Text>
                    </Group>
                    <NumberFormatter
                      allowNegative={false}
                      value={item.amount}
                      prefix="₹ "
                      thousandsGroupStyle="lakh"
                      thousandSeparator
                    />
                  </Group>
                ))}
              <Divider my="xs" variant="dashed" />
              <Text mb="xs" fw="bolder">
                Split Among
              </Text>
              {splitAmong
                ?.filter((item) => item.expense === selectedExpense?._id)
                ?.map((item) => (
                  <Group mb="xs" key={item._id} justify="space-between">
                    <Group gap="xs">
                      <Avatar
                        size="sm"
                        color={
                          colors[
                            sumAscii(
                              users.find((user) => user.userId === item?.user)
                                .name
                            ) - 1
                          ]
                        }
                      >
                        {getInitials(
                          users.find((user) => user.userId === item?.user).name
                        )}
                      </Avatar>
                      <Text>
                        {users.find((user) => user.userId === item?.user).name}
                      </Text>
                    </Group>
                    <NumberFormatter
                      allowNegative={false}
                      value={item.amount}
                      prefix="₹ "
                      thousandsGroupStyle="lakh"
                      thousandSeparator
                    />
                  </Group>
                ))}
            </Paper>
          </Modal>
        </>
      )}
    </>
  );
};

export default Page;
