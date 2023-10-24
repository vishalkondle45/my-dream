import { api } from "@/convex/_generated/api";
import {
  ActionIcon,
  Box,
  Checkbox,
  Group,
  Menu,
  Paper,
  Text,
  ThemeIcon,
  rem,
} from "@mantine/core";
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
  IconCopy,
  IconDotsVertical,
  IconEye,
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
import { useMutation } from "convex/react";
import dayjs from "dayjs";

const Todo = ({ todo }) => {
  const update = useMutation(api.todos.update);
  const remove = useMutation(api.todos.remove);

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

  return (
    <Paper px="sm" py="xs" mt="xs" shadow="xl" withBorder>
      <Group mih={rem(32)} justify="space-between" wrap="nowrap" align="center">
        <Group wrap="nowrap" gap="xs">
          <Checkbox
            checked={todo?.completedOn}
            onChange={() => {}}
            size="xs"
            radius="xl"
          />
          <Box>
            <Text size="sm" fw={500}>
              {todo?.todo}
            </Text>
            <Group justify="left" gap="xs" c="gray">
              {todo?.title && <Text size="xs">{todo?.title}</Text>}
              {todo?.isAddedToMyDay && (
                <Group gap={2}>
                  <ThemeIcon size="xs" variant="transparent">
                    <IconSun />
                  </ThemeIcon>
                  <Text size="xs">My Day</Text>
                </Group>
              )}
              {todo?.date && (
                <Group gap={2}>
                  <ThemeIcon size="xs" variant="transparent">
                    <IconCalendarEvent />
                  </ThemeIcon>
                  <Text size="xs">
                    Due {dayjs(todo?.date, "DD-MM-YYYY").format("ddd, MMM DD")}
                  </Text>
                </Group>
              )}
              {todo?.notes && (
                <ThemeIcon size="xs" variant="transparent">
                  <IconNote />
                </ThemeIcon>
              )}
              {todo?.category && (
                <ThemeIcon
                  variant="light"
                  size="xs"
                  radius="xl"
                  c={todo?.category}
                >
                  <IconCircleFilled />
                </ThemeIcon>
              )}
            </Group>
          </Box>
        </Group>
        <Group>
          <ActionIcon size="xs" variant="transparent">
            <IconEye />
            {/* <IconLayoutSidebarRightExpand /> */}
          </ActionIcon>
          <ActionIcon
            size="xs"
            variant="transparent"
            onClick={() => onUpdate({ isImportant: !todo.isImportant })}
          >
            {todo?.isImportant ? <IconStarFilled /> : <IconStar />}
          </ActionIcon>
          <Menu position="bottom-end">
            <Menu.Target>
              <ActionIcon size="xs" variant="transparent">
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
                  onUpdate({ isAddedToMyDay: !todo.isAddedToMyDay })
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
                onClick={() => onUpdate({ isImportant: !todo.isImportant })}
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
                    completedOn: todo.completedOn
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
              <Menu.Item leftSection={<IconPlaylistAdd size={20} stroke={1} />}>
                Create new list from this task
              </Menu.Item>
              <Menu.Item
                leftSection={<IconListSearch size={20} stroke={1} />}
                rightSection={<IconChevronRight size={20} stroke={1} />}
              >
                Move task to...
              </Menu.Item>
              <Menu.Item
                leftSection={<IconCopy size={20} stroke={1} />}
                rightSection={<IconChevronRight size={20} stroke={1} />}
              >
                Copy task to...
              </Menu.Item>
              <Menu.Divider />
              <Menu.Item
                c="red"
                leftSection={<IconTrash size={20} stroke={1} />}
                onClick={onRemove}
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