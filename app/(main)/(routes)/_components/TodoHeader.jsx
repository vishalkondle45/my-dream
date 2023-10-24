import { Button, Group, Menu, Text, ThemeIcon } from "@mantine/core";
import {
  IconArrowsSort,
  IconCalendarEvent,
  IconCalendarTime,
  IconHome,
  IconSortAZ,
  IconStar,
  IconSun,
} from "@tabler/icons-react";

const TodoHeader = () => {
  return (
    <Group justify="space-between" align="center" mb="lg">
      <Group gap={8}>
        <ThemeIcon variant="transparent">
          <IconHome />
        </ThemeIcon>
        <Text fz={20} fw={600}>
          {"Todos"}
        </Text>
      </Group>
      <Group>
        <Menu shadow="md" position="bottom-end">
          <Menu.Target>
            <Button variant="subtle" leftSection={<IconArrowsSort size={16} />}>
              Sort
            </Button>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item leftSection={<IconStar size={16} />}>
              Importance
            </Menu.Item>
            <Menu.Item leftSection={<IconCalendarEvent size={16} />}>
              Due date
            </Menu.Item>
            <Menu.Item leftSection={<IconSun size={16} />}>
              Added to My Day
            </Menu.Item>
            <Menu.Item leftSection={<IconSortAZ size={16} />}>
              Alphabecally
            </Menu.Item>
            <Menu.Item leftSection={<IconCalendarTime size={16} />}>
              Creation Time
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Group>
    </Group>
  );
};

export default TodoHeader;
