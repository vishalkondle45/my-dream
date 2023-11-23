import { Box, Group, Paper, Text, ThemeIcon } from "@mantine/core";
import { IconReceipt } from "@tabler/icons-react";

const Expenses = () => {
  return (
    <Box>
      <Text my="xs" size="sm" fw={700} tt="uppercase">
        November 2023
      </Text>
      <Paper>
        <Text size="xs">Nov 03</Text>
        <Group justify="space-between">
          <Group>
            <ThemeIcon>
              <IconReceipt />
            </ThemeIcon>
            <Box>
              <Text size="sm" fw={700}>
                Hi
              </Text>
              <Text size="sm" fw={300}>
                You paid $ 100
              </Text>
            </Box>
          </Group>
          <Group justify="right">
            <Text size="sm" c="green">
              $ 50
            </Text>
          </Group>
        </Group>
      </Paper>
    </Box>
  );
};

export default Expenses;
