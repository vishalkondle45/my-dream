"use client";
import { api } from "@/convex/_generated/api";
import { colors } from "@/utils/constants";
import {
  Badge,
  Group,
  List,
  NumberFormatter,
  RingProgress,
  Select,
  Skeleton,
  Stack,
  Text,
  ThemeIcon,
} from "@mantine/core";
import { IconSquare, IconSquareFilled } from "@tabler/icons-react";
import { useQuery } from "convex/react";

const Analysis = ({ groups, group, setGroup }) => {
  const getPaidBy = useQuery(api.expense.getPaidBy, { group: group });
  const getSplitAmong = useQuery(api.expense.getSplitAmong, { group: group });
  const users = useQuery(api.split.getUsers, { group: group });
  const loadingAnalysis = !getSplitAmong || !getPaidBy || !users;
  const userColors =
    users &&
    users.map((user, i) => ({
      user: user.userId,
      color: colors[i],
    }));
  return (
    <>
      <Select
        label="Select Group"
        placeholder="Pick value"
        value={group}
        onChange={setGroup}
        allowDeselect={false}
        searchable
        data={groups?.map(({ _id, type, name }) => ({
          value: _id,
          label: `${name} (${type[0].toUpperCase()}${type.slice(1)})`,
        }))}
        styles={{ dropdown: { borderRadius: 16 } }}
      />
      <Skeleton visible={loadingAnalysis}>
        <Group justify="space-evenly" wrap="nowrap">
          {users && getPaidBy && (
            <RingProgress
              size={150}
              thickness={20}
              roundCaps
              label={
                <Text
                  ta="center"
                  px="xs"
                  fw={700}
                  style={{ pointerEvents: "none" }}
                >
                  Paid
                </Text>
              }
              sections={users?.map((item, i) => {
                const userTotalAmountPaid = getPaidBy
                  ?.filter(({ user }) => user === item.userId)
                  ?.reduce((n, { amount }) => n + amount, 0);
                const totalAmountPaid = getPaidBy?.reduce(
                  (n, { amount }) => n + amount,
                  0
                );

                return {
                  value: (userTotalAmountPaid / totalAmountPaid) * 100,
                  color: userColors?.find(({ user }) => user === item.userId)
                    .color,
                  tooltip: `${item.name} – ₹${userTotalAmountPaid}`,
                };
              })}
            />
          )}
          {users && getSplitAmong && (
            <RingProgress
              size={150}
              thickness={20}
              roundCaps
              label={
                <Text
                  ta="center"
                  px="xs"
                  fw={700}
                  style={{ pointerEvents: "none" }}
                >
                  Split
                </Text>
              }
              sections={users?.map((item, i) => {
                const userTotalAmountSplit = getSplitAmong
                  ?.filter(({ user }) => user === item.userId)
                  ?.reduce((n, { amount }) => n + amount, 0);
                const totalAmountSplit = getSplitAmong?.reduce(
                  (n, { amount }) => n + amount,
                  0
                );
                return {
                  value: (userTotalAmountSplit / totalAmountSplit) * 100,
                  color: userColors?.find(({ user }) => user === item.userId)
                    ?.color,
                  tooltip: `${item.name} – ₹${userTotalAmountSplit}`,
                };
              })}
            />
          )}
        </Group>
        <Stack gap={0}>
          {users?.map((item, i) => (
              <Group>
                <ThemeIcon
                  radius="xs"
                  variant="transparent"
                  color={
                    userColors?.find(({ user }) => user === item.userId)?.color
                  }
                >
                  <IconSquareFilled />
                </ThemeIcon>
                <Text>{item.name}</Text>
              </Group>
            )
          )}
        </Stack>
      </Skeleton>
    </>
  );
};

export default Analysis;
