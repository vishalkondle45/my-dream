import { sidebarDataTodos } from "@/utils/constants";
import {
  ActionIcon,
  Burger,
  Button,
  Drawer,
  Group,
  Menu,
  Text,
  ThemeIcon,
} from "@mantine/core";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { IconArrowsSort, IconList } from "@tabler/icons-react";
import TodoSidebar from "./TodoSidebar";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

const TodoHeader = ({ icon, setSort, sortMap, header }) => {
  const [opened, { toggle }] = useDisclosure(false);
  const isMobile = useMediaQuery("(max-width: 600px)");

  let lists = useQuery(api.lists.get);
  let data = [...sidebarDataTodos];
  if (lists) {
    lists?.forEach((list) => {
      let i = sidebarDataTodos.findIndex(
        (o) => o.route == `/todos/${list?._id}`
      );
      if (i > -1) {
        sidebarDataTodos[i].text = list.title;
      } else {
        data.push({
          icon: <IconList size={18} />,
          text: list?.title,
          route: `/todos/${list?._id}`,
        });
      }
    });
  }

  return (
    <Group justify="space-between" align="center">
      <Group gap={8} wrap="nowrap">
        {isMobile && (
          <>
            <Drawer
              size={"55%"}
              opened={opened}
              onClose={toggle}
              withCloseButton={false}
            >
              <TodoSidebar data={data} />
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
            {isMobile ? (
              <ActionIcon variant="subtle">
                <IconArrowsSort />
              </ActionIcon>
            ) : (
              <Button
                variant="subtle"
                leftSection={<IconArrowsSort size={16} />}
              >
                Sort
              </Button>
            )}
          </Menu.Target>
          <Menu.Dropdown>
            {sortMap?.map((item) => (
              <Menu.Item
                key={item.value}
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
