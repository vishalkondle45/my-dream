import { colors } from "@/utils/constants";
import { getInitials, sumAscii } from "@/utils/functions";
import {
  ActionIcon,
  Avatar,
  Button,
  Grid,
  Group,
  NumberFormatter,
  Paper,
  Stack,
  Text,
} from "@mantine/core";
import {
  IconArrowRight,
  IconBellRingingFilled,
  IconCurrencyRupee,
  IconMinus,
} from "@tabler/icons-react";

const Balance = ({ item, user, paidBy, splitAmong, expenses }) => {
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
                <Group wrap="nowrap" justify="space-between" gap="xs">
                  <IconMinus size={16} />
                  <Stack ta="center" gap={0}>
                    <Text c={youWill < 0 ? "red" : "green"}>
                      <NumberFormatter
                        prefix="₹ "
                        value={youWill}
                        thousandsGroupStyle="lakh"
                        thousandSeparator
                        allowNegative={false}
                        style={{
                          whiteSpace: "nowrap",
                        }}
                      />
                    </Text>
                    <Text size="sm" style={{ whiteSpace: "nowrap" }}>
                      will pay
                    </Text>
                  </Stack>
                  <IconArrowRight size={16} />
                </Group>
              </Group>
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
                <ActionIcon title="Remind" variant="outline" radius="md">
                  <IconBellRingingFilled size={16} />
                </ActionIcon>
                <ActionIcon title="Settle" variant="filled" radius="md">
                  <IconCurrencyRupee size={18} />
                </ActionIcon>
              </Stack>
            </Grid.Col>
          </Grid>
        </Paper>
      )}
    </>
  );
};

export default Balance;
