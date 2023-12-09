import { api } from "@/convex/_generated/api";
import { colors, sidebarDataTodos, sortMap } from "@/utils/constants";
import {
  ActionIcon,
  Burger,
  Button,
  CheckIcon,
  Drawer,
  Group,
  Menu,
  Popover,
  Text,
  TextInput,
  ThemeIcon,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import {
  IconArrowsSort,
  IconCheck,
  IconChevronRight,
  IconCursorText,
  IconDots,
  IconList,
  IconPalette,
  IconPrinter,
  IconTrash,
  IconX,
} from "@tabler/icons-react";
import { useMutation, useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import TodoSidebar from "./TodoSidebar";

const TodoHeader_ = ({ queryParams, list, setSort }) => {
  let lists = useQuery(api.lists.get);
  const update = useMutation(api.lists.update);
  const removeList = useMutation(api.lists.remove);
  const [isRename, setIsRename] = useState(false);
  const [opened, { toggle }] = useDisclosure(false);
  const isMobile = useMediaQuery("(max-width: 600px)");
  const router = useRouter();

  const form = useForm({ initialValues: { rename: list?.title } });

  const onUpdate = async (object) => {
    if (!queryParams?.list_id) return;
    const id = notifications.show({
      title: "Processing...",
      loading: true,
      withBorder: true,
      autoClose: false,
      withCloseButton: false,
    });
    await update({ _id: queryParams?.list_id, ...object })
      .then((res) => {
        notifications.update({
          id,
          title: "Completed!",
          icon: <IconCheck size={16} />,
          color: "green",
          withBorder: true,
          loading: false,
          autoClose: 400,
        });
      })
      .catch((error) => console.log(error))
      .finally(() => setIsRename(false));
  };

  const onRemoveList = async (list) => {
    if (!list?._id) return;
    const id = notifications.show({
      title: "Deleting...",
      loading: true,
      withBorder: true,
      autoClose: false,
      withCloseButton: false,
    });
    await removeList({ _id: list?._id })
      .then((res) => {
        router.push(res ? `/todos/${res}` : "/todos");
        notifications.update({
          id,
          title: "Deleted!",
          icon: <IconCheck size={16} />,
          color: "green",
          withBorder: true,
          loading: false,
          autoClose: 400,
        });
      })
      .catch((error) => console.log(error));
  };

  const openModal = () =>
    modals.openConfirmModal({
      title: `"${list?.title}" will be permanently deleted.`,
      children: <Text size="sm">You wont be able to undo this action.</Text>,
      labels: { confirm: "Confirm", cancel: "Cancel" },
      confirmProps: { color: "red" },
      onCancel: () => {},
      onConfirm: () => onRemoveList(list),
    });

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

  const [opened1, { close, open }] = useDisclosure(false);

  useEffect(() => {
    close();
  }, [list]);

  return (
    <Group justify="space-between" wrap="nowrap">
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
        {!isMobile && !isRename && (
          <ThemeIcon c={list?.color} variant="transparent">
            <IconList />
          </ThemeIcon>
        )}
        {isRename ? (
          <form
            onSubmit={form.onSubmit((values) => {
              onUpdate({
                title: values.rename.length
                  ? values.rename.trim()
                  : list?.title,
              });
              form.setFieldValue("rename", values.rename.trim());
            })}
          >
            <Group wrap="nowrap">
              <TextInput
                {...form.getInputProps("rename")}
                styles={{ input: { fontWeight: 700 } }}
                radius="xs"
              />
              <Group gap="xs" wrap="nowrap">
                <ActionIcon
                  variant="subtle"
                  color="red"
                  onClick={() => {
                    form.resetDirty();
                    setIsRename(false);
                  }}
                >
                  <IconX />
                </ActionIcon>
                <ActionIcon variant="subtle" color="green" type="submit">
                  <IconCheck />
                </ActionIcon>
              </Group>
            </Group>
          </form>
        ) : (
          <Text
            c={list?.color}
            fw={600}
            onClick={() => setIsRename(true)}
            fz={20}
          >
            {list?.title}
          </Text>
        )}
        {!isRename && (
          <Menu shadow="md" closeOnItemClick={isMobile ? false : true}>
            <Menu.Target>
              <ActionIcon c={list?.color} variant="transparent">
                <IconDots />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item ta="center" disabled>
                List Options
              </Menu.Item>
              <Menu.Divider />
              <Menu.Item
                onClick={() => setIsRename(true)}
                leftSection={<IconCursorText size={18} />}
              >
                Rename list
              </Menu.Item>
              <Menu.Item
                leftSection={<IconPalette size={18} />}
                rightSection={
                  <Popover
                    width={330}
                    position="right"
                    shadow="md"
                    opened={!isMobile ? opened1 : undefined}
                  >
                    <Popover.Target>
                      <IconChevronRight
                        onMouseEnter={open}
                        onMouseLeave={close}
                        size={18}
                      />
                    </Popover.Target>
                    <Popover.Dropdown>
                      <Group gap="xs" onMouseEnter={open} onMouseLeave={close}>
                        {colors.map((color) => (
                          <ActionIcon
                            key={color}
                            radius="xl"
                            color={color}
                            onClick={() => onUpdate({ color })}
                          >
                            {color === list?.color && <CheckIcon size={14} />}
                          </ActionIcon>
                        ))}
                      </Group>
                    </Popover.Dropdown>
                  </Popover>
                }
              >
                Change theme
              </Menu.Item>

              {/* <Menu.Item
                leftSection={<IconPalette size={18} />}
                rightSection={
                  <Popover
                    position="bottom"
                    withArrow
                    shadow="md"
                    opened={opened1}
                  >
                    <Popover.Target>
                      <IconChevronRight
                        onMouseEnter={open}
                        onMouseLeave={close}
                        size={18}
                      />
                    </Popover.Target>
                    <Popover.Dropdown>
                      <Group gap="xs" p="sm">
                        {colors.map((color) => (
                          <ActionIcon
                            key={color}
                            radius="xl"
                            color={color}
                            onClick={() => onUpdate({ color })}
                          >
                            {color === list?.color && <CheckIcon size={14} />}
                          </ActionIcon>
                        ))}
                      </Group>
                    </Popover.Dropdown>
                  </Popover>
                }
              >
                Change theme
              </Menu.Item> */}

              {/* <Menu
                trigger={isMobile ? "click" : "hover"}
                position="right-start"
              >
                <Menu.Target>
                  <Menu.Item
                    leftSection={<IconPalette size={18} />}
                    rightSection={<IconChevronRight size={18} />}
                  >
                    Change theme
                  </Menu.Item>
                </Menu.Target>
                <Menu.Dropdown>
                  <Group gap="xs" p="sm">
                    {colors.map((color) => (
                      <ActionIcon
                        key={color}
                        radius="xl"
                        color={color}
                        onClick={() => onUpdate({ color })}
                      >
                        {color === list?.color && <CheckIcon size={14} />}
                      </ActionIcon>
                    ))}
                  </Group>
                </Menu.Dropdown>
              </Menu> */}
              <Menu.Item leftSection={<IconPrinter size={18} />}>
                Print list
              </Menu.Item>
              <Menu.Divider />
              <Menu.Item
                onClick={openModal}
                c="red"
                leftSection={<IconTrash size={18} />}
              >
                Delete list
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        )}
      </Group>
      <Menu shadow="md" position="bottom-end">
        <Menu.Target>
          {isMobile ? (
            <ActionIcon c={list?.color} variant="subtle">
              <IconArrowsSort />
            </ActionIcon>
          ) : (
            <Button
              c={list?.color}
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
              key={item?.value}
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
  );
};

export default TodoHeader_;
