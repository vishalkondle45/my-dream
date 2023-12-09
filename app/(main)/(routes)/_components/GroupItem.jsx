import { api } from "@/convex/_generated/api";
import { getGroupIconByType } from "@/utils/constants";
import {
  Group,
  NumberFormatter,
  Paper,
  Skeleton,
  Stack,
  Text,
  ThemeIcon,
} from "@mantine/core";
import { useQuery } from "convex/react";
import { useRouter } from "next/navigation";

const GrouItem = ({ group }) => {
  const user = useQuery(api.users?.getCurrentUser);
  // const users = useQuery(api.split?.getUsers, { group: group?._id });
  const expenses = useQuery(api.expense?.getExpenses, { group: group?._id });
  const splitAmong = useQuery(api.expense?.getSplitAmong, {
    group: group?._id,
  });
  const paidBy = useQuery(api.expense?.getPaidBy, { group: group?._id });
  const router = useRouter();

  const nonSettlementExpenses = expenses
    ?.filter(({ isSettlement }) => !isSettlement)
    .map(({ _id }) => _id);

  const getSpendings = (userId) =>
    paidBy
      ?.filter(
        (item) =>
          item?.user === userId && nonSettlementExpenses.includes(item?.expense)
      )
      ?.reduce((n, { amount }) => n + amount, 0) || 0;

  const getPaids = (userId) =>
    paidBy
      ?.filter(
        (item) =>
          item?.user === userId &&
          !nonSettlementExpenses.includes(item?.expense)
      )
      ?.reduce((n, { amount }) => n + amount, 0) || 0;

  const getShare = (userId) =>
    splitAmong
      ?.filter(
        (item) =>
          item?.user === userId && nonSettlementExpenses.includes(item?.expense)
      )
      ?.reduce((n, { amount }) => n + amount, 0) || 0;

  const getReceived = (userId) =>
    splitAmong
      ?.filter(
        (item) =>
          item?.user === userId &&
          !nonSettlementExpenses.includes(item?.expense)
      )
      ?.reduce((n, { amount }) => n + amount, 0) || 0;

  const owe = getSpendings(user?.subject) - getReceived(user?.subject);
  const owed = getShare(user?.subject) - getPaids(user?.subject);

  let loading = !expenses || !splitAmong || !paidBy || !user;

  return (
    <>
      <Skeleton visible={loading} animate>
        <Paper
          onClick={() => router.push(`/split/${group._id}`)}
          style={{ cursor: "pointer" }}
          px="xs"
          py="md"
          shadow="xl"
          withBorder
        >
          <Group justify="space-between">
            <Group>
              <ThemeIcon size="xl" variant="outline">
                {getGroupIconByType(group.type)}
              </ThemeIcon>
              <Stack gap={0}>
                <Text fw={700}>{group.name}</Text>
                <Text size="xs" fw={300}>
                  New
                </Text>
              </Stack>
            </Group>

            {owe !== owed && (
              <Stack gap={0}>
                <Group gap="xs" justify="right">
                  <Text size="xs">You owe</Text>
                  <Text size="xs" c="green">
                    <NumberFormatter
                      prefix="₹ "
                      value={owe}
                      thousandsGroupStyle="lakh"
                      thousandSeparator
                      allowNegative={false}
                    />
                  </Text>
                </Group>
                <Group gap="xs" justify="right">
                  <Text size="xs">You are owed</Text>
                  <Text size="xs" c="red">
                    <NumberFormatter
                      prefix="₹ "
                      value={owed}
                      thousandsGroupStyle="lakh"
                      thousandSeparator
                      allowNegative={false}
                    />
                  </Text>
                </Group>
              </Stack>
            )}
          </Group>
        </Paper>
      </Skeleton>
    </>
  );
};

export default GrouItem;
