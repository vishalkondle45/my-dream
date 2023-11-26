import { Divider, Paper, Text, rem } from "@mantine/core";
import React from "react";
import SummarySingleItem from "./SummarySingleItem";

const SpendingItem = ({ color, name, spendings, share, balance }) => {
  return (
    <>
      <Text c={color} fw={500} mb="xs">
        {name}
      </Text>
      <Paper radius="lg" px="sm" mb="xs" py="xs" withBorder shadow="xl">
        <SummarySingleItem title="Your total spends (A)" value={spendings} />
        <Divider my={rem(4)} variant="dashed" />
        <SummarySingleItem title="Your total share (B)" value={share} />
        <Divider my={rem(4)} variant="dashed" />
        <SummarySingleItem title="Money you paid till now (C)" value={0} />
        <Divider my={rem(4)} variant="dashed" />
        <SummarySingleItem title="Money you received till now (D)" value={0} />
        <Divider my={rem(4)} variant="dashed" />
        <SummarySingleItem
          color={balance < 0 ? "red" : "green"}
          title="Balance (A+C)-(B+D)"
          value={balance}
        />
      </Paper>
    </>
  );
};

export default SpendingItem;
