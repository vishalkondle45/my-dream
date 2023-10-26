import { Button, Group, Menu, Text, ThemeIcon } from "@mantine/core";
import { IconArrowsSort } from "@tabler/icons-react";

const TodoHeader = ({ icon, setSort, sortMap }) => {
  return (
    <Group justify="space-between" align="center" mb="lg">
      <Group gap={8}>
        <ThemeIcon variant="transparent">{icon}</ThemeIcon>
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
            {sortMap?.map((item) => (
              <Menu.Item
                onClick={() =>
                  setSort((sort) => ({ ...sort, sortBy: item?.value }))
                }
                leftSection={item?.icon}
              >
                {item?.label}
              </Menu.Item>
            ))}
          </Menu.Dropdown>
        </Menu>
      </Group>
    </Group>
  );
};

export default TodoHeader;
