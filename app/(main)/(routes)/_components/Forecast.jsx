import { Group, Paper, Stack, Text, ThemeIcon } from "@mantine/core";
import { IconCaretDownFilled, IconCaretUpFilled } from "@tabler/icons-react";

const Forecast = ({ item, title }) => {
  return (
    <Paper withBorder shadow="xl" p="lg">
      <Text mb="xs">{title}</Text>
      <Stack gap={0}>
        <Group gap="xs">
          <ThemeIcon variant="transparent" color="green">
            <IconCaretUpFilled size={24} />
          </ThemeIcon>
          <Text>{item?.Maximum?.Metric?.Value}° C</Text>
        </Group>
        <Group gap="xs">
          <ThemeIcon variant="transparent" color="red">
            <IconCaretDownFilled size={24} />
          </ThemeIcon>
          <Text>{item?.Minimum?.Metric?.Value}° C</Text>
        </Group>
      </Stack>
    </Paper>
  );
};

export default Forecast;
