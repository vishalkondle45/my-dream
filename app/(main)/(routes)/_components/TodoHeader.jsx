import { sidebarData } from "@/utils/constants";
import {
  Burger,
  Button,
  Drawer,
  Group,
  Menu,
  Text,
  ThemeIcon,
} from "@mantine/core";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { IconArrowsSort } from "@tabler/icons-react";
import TodoSidebar from "./TodoSidebar";

const TodoHeader = ({ icon, setSort, sortMap, header }) => {
  const [opened, { toggle }] = useDisclosure(false);
  const isMobile = useMediaQuery("(max-width: 600px)");
  return (
    <Group justify="space-between" align="center">
      <Group gap={8}>
        {isMobile && (
          <>
            <Drawer
              size={"55%"}
              opened={opened}
              onClose={toggle}
              withCloseButton={false}
            >
              <TodoSidebar data={sidebarData} />
            </Drawer>
            <Burger
              opened={opened}
              onClick={toggle}
              hiddenFrom="xs"
              size="sm"
            />
          </>
        )}
        <ThemeIcon variant="transparent">{icon}</ThemeIcon>
        <Text fz={20} fw={600}>
          {header}
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
