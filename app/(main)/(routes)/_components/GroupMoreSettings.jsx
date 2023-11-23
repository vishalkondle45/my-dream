import { Box, Group, Paper, Switch, Text } from "@mantine/core";
import React from "react";

const GroupMoreSettings = () => {
  return (
    <Box mt="md">
      <Text fw="bold">More Settings</Text>
      <Paper withBorder shadow="xl" mt="sm" p="sm">
        <Group justify="space-between">
          <Text>Simplify Balances</Text>
          <Switch />
        </Group>
        <Text fz="xs" c="gray" ta="justify">
          We simplify your balances among friends in a group by default to help
          you reduce the number of transactions.
        </Text>
      </Paper>
    </Box>
  );
};

export default GroupMoreSettings;
