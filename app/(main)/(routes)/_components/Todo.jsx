import { api } from "@/convex/_generated/api";
var isToday = require("dayjs/plugin/isToday");
var isTomorrow = require("dayjs/plugin/isTomorrow");
import {
  ActionIcon,
  Box,
  Checkbox,
  Group,
  Menu,
  Paper,
  Popover,
  Text,
  ThemeIcon,
  rem,
} from "@mantine/core";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import {
  IconCalendarDue,
  IconCalendarEvent,
  IconCalendarUp,
  IconCalendarX,
  IconCheck,
  IconChevronRight,
  IconCircle,
  IconCircleCheck,
  IconCircleFilled,
  IconDotsVertical,
  IconEdit,
  IconListSearch,
  IconNote,
  IconPlaylistAdd,
  IconStar,
  IconStarFilled,
  IconStarOff,
  IconSun,
  IconSunOff,
  IconTrash,
} from "@tabler/icons-react";
import { useMutation, useQuery } from "convex/react";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
dayjs.extend(isToday);
dayjs.extend(isTomorrow);

const Todo = ({ todo, setEdit, edit, color, hide }) => {
  const update = useMutation(api.todos.update);
  const remove = useMutation(api.todos.remove);
  const lists = useQuery(api.lists.get);
  const move = useMutation(api.todos.move);
  const copy = useMutation(api.todos.copy);
  const createList = useMutation(api.todos.createList);
  const isMobile = useMediaQuery("(max-width: 600px)");

  const openModal = () =>
    modals.openConfirmModal({
      title: `"${todo?.todo}" will be permanently deleted.`,
      children: <Text size="sm">You wont be able to undo this action.</Text>,
      labels: { confirm: "Confirm", cancel: "Cancel" },
      confirmProps: { color: "red" },
      onCancel: () => {},
      onConfirm: () => onRemove(),
    });

  const onCopy = async (list) => {
    if (!todo?._id) return;
    const id = notifications.show({
      title: "Processing...",
      loading: true,
      withBorder: true,
      autoClose: false,
      withCloseButton: false,
    });
    await copy({ _id: todo?._id, list })
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
      .catch((error) => console.log(error));
  };

  const onMove = async (list) => {
    if (!todo?._id) return;
    const id = notifications.show({
      title: "Processing...",
      loading: true,
      withBorder: true,
      autoClose: false,
      withCloseButton: false,
    });
    await move({ _id: todo?._id, list })
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
      .catch((error) => console.log(error));
  };

  const onCreateNewListFromTodo = async () => {
    if (!todo?._id) return;
    const id = notifications.show({
      title: "Processing...",
      loading: true,
      withBorder: true,
      autoClose: false,
      withCloseButton: false,
    });
    await createList({ _id: todo?._id })
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
      .catch((error) => console.log(error));
  };

  const onUpdate = async (object) => {
    if (!todo?._id) return;
    const id = notifications.show({
      title: "Processing...",
      loading: true,
      withBorder: true,
      autoClose: false,
      withCloseButton: false,
    });
    await update({ _id: todo?._id, ...object })
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
      .catch((error) => console.log(error));
  };

  const onRemove = async () => {
    if (!todo?._id) return;
    const id = notifications.show({
      title: "Deleting...",
      loading: true,
      withBorder: true,
      autoClose: false,
      withCloseButton: false,
    });
    await remove({ _id: todo?._id })
      .then((res) => {
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

  const [opened1, { close, open }] = useDisclosure(false);
  const [opened2, { close: close1, open: open1 }] = useDisclosure(false);

  useEffect(() => {
    close();
    setOpened(false);
  }, [todo]);

  const [opened, setOpened] = useState(false);

  return (
    <Paper px="sm" py="xs" mt="xs" shadow="xl" withBorder>
      <Group mih={rem(32)} justify="space-between" wrap="nowrap" align="center">
        <Group wrap="nowrap" gap="xs">
          <Checkbox
            color={color}
            checked={todo?.completedOn}
            onChange={() =>
              onUpdate({
                completedOn: todo?.completedOn
                  ? ""
                  : dayjs().format("MM-DD-YYYY"),
              })
            }
            size="xs"
            radius="xl"
          />
          <Box>
            <Text size="sm" fw={500}>
              {todo?.todo}
            </Text>
            <Group justify="left" gap="xs" style={{ rowGap: 0 }} c="gray">
              {hide !== "list" && (
                <Text size="xs" title="List">
                  {lists?.find((list) => list?._id === todo?.list)?.title ||
                    "Todos"}
                </Text>
              )}
              {todo?.isAddedToMyDay && hide !== "isAddedToMyDay" && (
                <Group gap={2} title="My Day">
                  <ThemeIcon size="xs" variant="transparent">
                    <IconSun />
                  </ThemeIcon>
                  <Text size="xs">My Day</Text>
                </Group>
              )}
              {todo?.date && (
                <Group gap={2} title="Due date">
                  <ThemeIcon
                    c={
                      todo?.completedOn
                        ? dayjs(todo?.completedOn).isAfter(
                            dayjs(todo?.date),
                            "date"
                          )
                          ? "red"
                          : ""
                        : dayjs().isAfter(dayjs(todo?.date), "date")
                        ? "red"
                        : ""
                    }
                    size="xs"
                    variant="transparent"
                  >
                    <IconCalendarEvent />
                  </ThemeIcon>
                  <Text
                    size="xs"
                    c={
                      todo?.completedOn
                        ? dayjs(todo?.completedOn).isAfter(
                            dayjs(todo?.date),
                            "date"
                          )
                          ? "red"
                          : ""
                        : dayjs().isAfter(dayjs(todo?.date), "date")
                        ? "red"
                        : ""
                    }
                  >
                    {dayjs(todo?.date).isToday()
                      ? "Today"
                      : dayjs(todo?.date).isTomorrow()
                      ? "Tomorrow"
                      : `Due ${dayjs(todo?.date, "DD-MM-YYYY").format(
                          "ddd, MMM DD"
                        )}`}
                  </Text>
                </Group>
              )}
              {todo?.notes && (
                <ThemeIcon title="Notes" size="xs" variant="transparent">
                  <IconNote />
                </ThemeIcon>
              )}
              {todo?.category.length && (
                <>
                  {todo?.category.map((category) => (
                    <ThemeIcon
                      variant="light"
                      size="xs"
                      radius="xl"
                      c={category}
                      key={category}
                      title={
                        category.charAt(0).toUpperCase() +
                        category.slice(1) +
                        " category"
                      }
                    >
                      <IconCircleFilled />
                    </ThemeIcon>
                  ))}
                </>
              )}
            </Group>
          </Box>
        </Group>
        <Group wrap="nowrap" gap={"xs"}>
          <ActionIcon
            size={isMobile ? "xs" : "md"}
            variant="transparent"
            onClick={() => setEdit(edit?._id === todo?._id ? null : todo)}
          >
            <IconEdit />
          </ActionIcon>
          <ActionIcon
            size={isMobile ? "xs" : "md"}
            variant="transparent"
            color={color}
            onClick={() => onUpdate({ isImportant: !todo?.isImportant })}
          >
            {todo?.isImportant ? <IconStarFilled /> : <IconStar />}
          </ActionIcon>
          <Menu
            position="bottom-end"
            opened={opened}
            onChange={setOpened}
            closeOnItemClick={false}
          >
            <Menu.Target>
              <ActionIcon size={isMobile ? "xs" : "md"} variant="transparent">
                <IconDotsVertical />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item
                leftSection={
                  todo?.isAddedToMyDay ? (
                    <IconSunOff size={20} stroke={1} />
                  ) : (
                    <IconSun size={20} stroke={1} />
                  )
                }
                onClick={() =>
                  onUpdate({ isAddedToMyDay: !todo?.isAddedToMyDay })
                }
              >
                {todo?.isAddedToMyDay ? "Remove from" : "Add to"} My Day
              </Menu.Item>
              <Menu.Item
                leftSection={
                  todo?.isImportant ? (
                    <IconStarOff size={20} stroke={1} />
                  ) : (
                    <IconStar size={20} stroke={1} />
                  )
                }
                onClick={() => onUpdate({ isImportant: !todo?.isImportant })}
              >
                {todo?.isImportant ? "Remove importance" : "Mark as important"}
              </Menu.Item>
              <Menu.Item
                leftSection={
                  todo?.completedOn ? (
                    <IconCircle size={20} stroke={1} />
                  ) : (
                    <IconCircleCheck size={20} stroke={1} />
                  )
                }
                onClick={() =>
                  onUpdate({
                    completedOn: todo?.completedOn
                      ? ""
                      : dayjs().format("MM-DD-YYYY"),
                  })
                }
              >
                Mark as {todo?.completedOn && "not"} completed
              </Menu.Item>
              <Menu.Divider />
              <Menu.Item
                leftSection={<IconCalendarDue size={20} stroke={1} />}
                onClick={() => onUpdate({ date: dayjs().format("MM-DD-YYYY") })}
              >
                Due today
              </Menu.Item>
              <Menu.Item
                leftSection={<IconCalendarUp size={20} stroke={1} />}
                onClick={() =>
                  onUpdate({ date: dayjs().add(1, "day").format("MM-DD-YYYY") })
                }
              >
                Due tomorrow
              </Menu.Item>
              {todo?.date && (
                <Menu.Item
                  leftSection={<IconCalendarX size={20} stroke={1} />}
                  onClick={() => onUpdate({ date: "" })}
                >
                  Remove due date
                </Menu.Item>
              )}
              <Menu.Divider />

              <Menu.Item
                onClick={() => onCreateNewListFromTodo()}
                leftSection={<IconPlaylistAdd size={20} stroke={1} />}
              >
                Create new list from this todo
              </Menu.Item>
              <Popover
                position="bottom-end"
                shadow="md"
                opened={!isMobile ? opened1 : undefined}
              >
                <Popover.Target>
                  <Menu.Item
                    leftSection={<IconListSearch size={18} />}
                    rightSection={<IconChevronRight size={18} />}
                    onMouseEnter={open}
                    onMouseLeave={close}
                  >
                    Move todo to...
                  </Menu.Item>
                </Popover.Target>
                <Popover.Dropdown p={0}>
                  <Box onMouseEnter={open} onMouseLeave={close}>
                    <Menu.Item onClick={() => onMove()}>Todos</Menu.Item>
                    {lists
                      ?.filter((o) => o?._id !== todo?.title)
                      ?.map((list) => (
                        <Menu.Item
                          key={list?._id}
                          onClick={() => onMove(list?._id)}
                        >
                          {list?.title}
                        </Menu.Item>
                      ))}
                  </Box>
                </Popover.Dropdown>
              </Popover>
              <Popover
                position="bottom-end"
                shadow="md"
                opened={!isMobile ? opened2 : undefined}
              >
                <Popover.Target>
                  <Menu.Item
                    leftSection={<IconListSearch size={18} />}
                    rightSection={<IconChevronRight size={18} />}
                    onMouseEnter={open1}
                    onMouseLeave={close1}
                  >
                    Copy todo to...
                  </Menu.Item>
                </Popover.Target>
                <Popover.Dropdown p={0}>
                  <Box onMouseEnter={open1} onMouseLeave={close1}>
                    <Menu.Item onClick={() => onCopy()}>Todos</Menu.Item>
                    {lists
                      ?.filter((o) => o?._id !== todo?.title)
                      ?.map((list) => (
                        <Menu.Item
                          key={list?._id}
                          onClick={() => onCopy(list?._id)}
                        >
                          {list?.title}
                        </Menu.Item>
                      ))}
                  </Box>
                </Popover.Dropdown>
              </Popover>
              <Menu.Divider />
              <Menu.Item
                c="red"
                leftSection={<IconTrash size={20} stroke={1} />}
                onClick={() => {
                  setOpened(false);
                  openModal();
                }}
              >
                Delete task
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </Group>
    </Paper>
  );
};

export default Todo;
