import { api } from "@/convex/_generated/api";
import { colors } from "@/utils/constants";
import { getInitials, sumAscii } from "@/utils/functions";
import {
  ActionIcon,
  Avatar,
  Badge,
  Button,
  Grid,
  Group,
  List,
  Modal,
  NumberFormatter,
  NumberInput,
  Paper,
  Stack,
  Text,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { showNotification } from "@mantine/notifications";
import {
  IconArrowRight,
  IconBellRingingFilled,
  IconCurrencyRupee,
  IconMinus,
  IconX,
} from "@tabler/icons-react";
import { useMutation } from "convex/react";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

const Balance = ({ item, user, paidBy, splitAmong, expenses }) => {
  const settle = useMutation(api.expense.settle);
  const [opened, { close, open }] = useDisclosure(false);

  let myRemaining =
    paidBy
      .filter((i) => i.user === user.subject)
      .reduce((n, { amount }) => n + amount, 0) -
    splitAmong
      .filter((i) => i.user === user.subject)
      .reduce((n, { amount }) => n + amount, 0);

  let userRemaining =
    splitAmong
      .filter((i) => i.user === item.userId)
      .reduce((n, { amount }) => n + amount, 0) -
    paidBy
      .filter((i) => i.user === item.userId)
      .reduce((n, { amount }) => n + amount, 0);

  const youWill = expenses
    .map((expense) => {
      let paidUsers = paidBy.filter((paid) => paid.expense === expense._id);
      let splitPaidUser = splitAmong.filter(
        (split) =>
          split.expense === expense._id &&
          paidBy.find(
            (paid) => paid.user === split.user && paid.expense === expense._id
          )
      );

      let paidUsersSum = paidUsers.reduce((n, { amount }) => n + amount, 0);
      let splitPaidUserSum = splitPaidUser.reduce(
        (n, { amount }) => n + amount,
        0
      );

      let extraPaidTotal = paidUsersSum - splitPaidUserSum;

      let selectedUserPaidAmount =
        paidUsers.find((paid) => paid.user === item.userId)?.amount || 0;

      let selectedUserSplitAmount =
        splitPaidUser.find((paid) => paid.user === item.userId)?.amount || 0;

      let selectedUserExtraPaidAmount =
        selectedUserPaidAmount - selectedUserSplitAmount;

      let selectedUserExtraPaidAmountPercentage =
        (selectedUserExtraPaidAmount / extraPaidTotal) * 100;

      let x =
        splitAmong.find(
          (split) =>
            split.expense === expense._id && split.user === user.subject
        )?.amount || 0;

      let y =
        paidBy.find(
          (paid) => paid.expense === expense._id && paid.user === user.subject
        )?.amount || 0;

      let thisUserNeedsToPay = x - y;

      let thisUserPaidAmount =
        paidUsers.find((paid) => paid.user === user.subject)?.amount || 0;

      let thisUserSplitAmount =
        splitPaidUser.find((paid) => paid.user === user.subject)?.amount || 0;

      let thisUserExtraPaidAmount = thisUserPaidAmount - thisUserSplitAmount;

      let thisUserExtraPaidAmountPercentage =
        (thisUserExtraPaidAmount / extraPaidTotal) * 100;

      let a =
        splitAmong.find(
          (split) => split.expense === expense._id && split.user === item.userId
        )?.amount || 0;

      let b =
        paidBy.find(
          (paid) => paid.expense === expense._id && paid.user === item.userId
        )?.amount || 0;

      let selectedUserNeedsToPay = a - b;

      let thisUserGetShouldGetFromSelectedUser =
        selectedUserNeedsToPay > 0
          ? (selectedUserNeedsToPay / 100) * thisUserExtraPaidAmountPercentage
          : 0;

      let selectedUserGetShouldGeyFromThisUser =
        thisUserNeedsToPay > 0
          ? (thisUserNeedsToPay / 100) * selectedUserExtraPaidAmountPercentage
          : 0;

      return (
        thisUserGetShouldGetFromSelectedUser -
        selectedUserGetShouldGeyFromThisUser
      );
    })
    .reduce((n, amount) => n + Number(amount), 0);

  const [amount, setAmount] = useState(Math.abs(youWill));

  const submitSettle = () => {
    settle({
      amount,
      sender: user.subject,
      receiver: item.userId,
      group: expenses[0].group,
      date: dayjs().format("MM-DD-YYYY"),
    })
      .then(() => {
        showNotification({
          color: "red",
          icon: <IconX />,
          message: `You settled ₹ ${amount} with ${item.name}`,
        });
        close();
      })
      .catch((error) => console.log(result));
  };

  useEffect(() => {
    if (youWill) {
      setAmount(Math.abs(amount));
    }
  }, [youWill]);

  return (
    <>
      {Boolean(myRemaining) && youWill !== 0 && (
        <Paper key={item._id} p="xs" shadow="xl" withBorder>
          <Grid align="center">
            <Grid.Col span={3}>
              <Stack
                title={youWill > 0 ? item.name : user?.name}
                style={{ alignItems: "center" }}
                gap={0}
              >
                <Avatar
                  size="md"
                  color={
                    colors[sumAscii(youWill > 0 ? item.name : user?.name) - 1]
                  }
                >
                  {getInitials(youWill > 0 ? item.name : user?.name)}
                </Avatar>
                <Text style={{ whiteSpace: "nowrap" }} size="xs">
                  {youWill > 0 ? item.name.slice(0, 8) : "You"}
                </Text>
              </Stack>
            </Grid.Col>
            <Grid.Col span={4}>
              <Group justify="space-between" wrap="nowrap" gap={0}>
                <IconMinus size={16} />
                <Text c={youWill < 0 ? "red" : "green"}>
                  <NumberFormatter
                    prefix="₹ "
                    value={youWill}
                    thousandsGroupStyle="lakh"
                    thousandSeparator
                    allowNegative={false}
                    style={{ whiteSpace: "nowrap" }}
                  />
                </Text>
                <IconArrowRight size={16} />
              </Group>
              <Text ta="center" size="sm" style={{ whiteSpace: "nowrap" }}>
                will pay
              </Text>
            </Grid.Col>
            <Grid.Col span={3}>
              <Stack
                title={youWill > 0 ? user.name : item?.name}
                style={{ alignItems: "center" }}
                gap={0}
              >
                <Avatar
                  size="md"
                  color={
                    colors[sumAscii(youWill > 0 ? user.name : item?.name) - 1]
                  }
                >
                  {getInitials(youWill > 0 ? user.name : item?.name)}
                </Avatar>
                <Text style={{ whiteSpace: "nowrap" }} size="xs">
                  {youWill > 0 ? "You" : item?.name.slice(0, 6)}
                </Text>
              </Stack>
            </Grid.Col>
            <Grid.Col span={2}>
              <Stack gap="xs">
                {youWill > 0 && (
                  <ActionIcon title="Remind" variant="outline" radius="md">
                    <IconBellRingingFilled size={16} />
                  </ActionIcon>
                )}
                {youWill < 0 && (
                  <ActionIcon
                    title="Settle"
                    variant="filled"
                    radius="md"
                    onClick={open}
                  >
                    <IconCurrencyRupee size={18} />
                  </ActionIcon>
                )}
              </Stack>
            </Grid.Col>
          </Grid>
        </Paper>
      )}

      <Modal withCloseButton={false} opened={opened} onClose={close}>
        <Badge size="lg" mb="sm" fullWidth>
          Record a payment
        </Badge>
        <Group mb="xs">
          <Text>
            You Paid <b>Amma</b>
          </Text>
          <Avatar size="sm">VK</Avatar>
        </Group>
        <NumberInput
          placeholder="Amount"
          leftSection={<IconCurrencyRupee size={18} />}
          w="100%"
          value={amount}
          onChange={(value) => setAmount(value)}
          mb="xs"
          min={1}
          styles={{ input: { fontWeight: 700, fontSize: 18 } }}
          hideControls
        />
        <Button fullWidth onClick={submitSettle}>
          Settle Up
        </Button>

        <>
          <Text size="sm" fw={700} mt="xs">
            Disclaimer :
          </Text>
          <List withPadding>
            <List.Item>
              <Text size="sm">Recording a payment doesn't move money</Text>
            </List.Item>
            {/* <List.Item>
              <Text size="sm">
                This option is intended for recording payments made outside
                mySplit.
              </Text>
            </List.Item> */}
          </List>
        </>
      </Modal>
    </>
  );
};

export default Balance;
