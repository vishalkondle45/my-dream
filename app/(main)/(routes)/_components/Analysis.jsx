"use client";
import { api } from "@/convex/_generated/api";
import { colors } from "@/utils/constants";
import { Group, RingProgress, Select, Skeleton, Text } from "@mantine/core";
import { useQuery } from "convex/react";

const Analysis = ({ groups, group, setGroup }) => {
  const getPaidBy = useQuery(api.expense.getPaidBy, { group: group });
  const getSplitAmong = useQuery(api.expense.getSplitAmong, { group: group });
  const users = useQuery(api.split.getUsers, { group: group });
  const loadingAnalysis = !getSplitAmong || !getPaidBy || !users;
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
              sections={users?.map((item, i) => ({
                value:
                  (getPaidBy
                    ?.filter(({ user }) => user === item.userId)
                    ?.reduce((n, { amount }) => n + amount, 0) /
                    getPaidBy?.reduce((n, { amount }) => n + amount, 0)) *
                  100,
                color: colors[i],
                tooltip: `${item.name} – ₹${getPaidBy
                  ?.filter(({ user }) => user === item.userId)
                  ?.reduce((n, { amount }) => n + amount, 0)}`,
              }))}
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
              sections={users?.map((item, i) => ({
                value:
                  (getSplitAmong
                    ?.filter(({ user }) => user === item.userId)
                    ?.reduce((n, { amount }) => n + amount, 0) /
                    getSplitAmong?.reduce((n, { amount }) => n + amount, 0)) *
                  100,
                color: colors[i],
                tooltip: `${item.name} – ₹${getSplitAmong
                  ?.filter(({ user }) => user === item.userId)
                  ?.reduce((n, { amount }) => n + amount, 0)}`,
              }))}
            />
          )}
        </Group>
      </Skeleton>
    </>
  );
};

export default Analysis;
