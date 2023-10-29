import { api } from "@/convex/_generated/api";
import {
  ActionIcon,
  Box,
  Button,
  Checkbox,
  Flex,
  Grid,
  Group,
  Menu,
  MultiSelect,
  Paper,
  Popover,
  Stack,
  Text,
  TextInput,
  Textarea,
  ThemeIcon,
  rem,
} from "@mantine/core";
import { Calendar } from "@mantine/dates";
import { useForm } from "@mantine/form";
import {
  IconCalendar,
  IconCalendarCheck,
  IconCalendarEvent,
  IconCalendarTime,
  IconCalendarUp,
  IconCategory,
  IconSend,
  IconStar,
  IconStarFilled,
  IconSun,
  IconSunOff,
  IconTag,
  IconX,
} from "@tabler/icons-react";
import { useMutation } from "convex/react";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

const EditTodo = ({ setEdit, edit }) => {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const categories = [
    { label: "💙 Blue", value: "blue" },
    { label: "❤️ Red", value: "red" },
    { label: "💚 Green", value: "green" },
    { label: "🧡 Orange", value: "orange" },
    { label: "💜 Purple", value: "purple" },
    { label: "💛 Yellow", value: "yellow" },
  ];

  const [opened, setOpened] = useState(false);
  const update = useMutation(api.todos.update);

  const onUpdate = async (object) => {
    if (!edit?._id) return;
    await update({
      _id: edit?._id,
      ...object,
      _creationTime: undefined,
      userId: undefined,
    })
      .then((res) => {})
      .catch((error) => console.log(error))
      .finally(() => setEdit(null));
  };

  const handleSelect = (date) => {
    form.setFieldValue("date", date);
    setOpened(false);
  };

  useEffect(() => {
    form.setValues(edit);
    form.setFieldValue("completedOn", edit.completedOn);
  }, []);

  const form = useForm({
    initialValues: {
      category: [],
      completedOn: "",
      date: "",
      isAddedToMyDay: false,
      isImportant: false,
      notes: "",
      list: "",
      todo: "",
    },
    validate: {
      todo: (value) => (value.length ? null : "This field is required."),
    },
  });
  return (
    <form onSubmit={form.onSubmit((values) => onUpdate(values))}>
      <Stack gap="xs">
        <Paper radius="xs">
          <Group gap={0} justify="space-between" align="center">
            <Checkbox
              title="Completed"
              radius="xl"
              checked={Boolean(form.values.completedOn)}
              onChange={() =>
                form.setFieldValue(
                  "completedOn",
                  form.values.completedOn ? "" : dayjs().format("MM-DD-YYYY")
                )
              }
            />
            <TextInput
              placeholder="Task"
              {...form.getInputProps("todo")}
              radius={0}
              styles={{
                input: {
                  outline: 0,
                  border: 0,
                  borderStyle: "none",
                  fontWeight: 700,
                  fontSize: rem(16),
                  paddingInline: 0,
                },
              }}
            />
            <ActionIcon
              onClick={() =>
                form.setFieldValue("isImportant", !form.values.isImportant)
              }
              title="Important"
              size="sm"
              variant="transparent"
            >
              {form.values.isImportant ? <IconStarFilled /> : <IconStar />}
            </ActionIcon>
          </Group>
        </Paper>
        <Paper
          radius="xs"
          p="xs"
          withBorder
          onClick={
            form.values.isAddedToMyDay
              ? () => {}
              : () => form.setFieldValue("isAddedToMyDay", true)
          }
        >
          <Group wrap="nowrap" justify="space-between">
            <Group>
              <ThemeIcon variant="transparent">
                {form.values.isAddedToMyDay ? <IconSunOff /> : <IconSun />}
              </ThemeIcon>
              <Text size="sm" fw={form.values.isAddedToMyDay && 700}>
                {form.values.isAddedToMyDay ? "Remove from" : "Add to"} My Day
              </Text>
            </Group>
            {form.values.isAddedToMyDay && (
              <ActionIcon
                variant="transparent"
                onClick={() => form.setFieldValue("isAddedToMyDay", false)}
              >
                <IconX />
              </ActionIcon>
            )}
          </Group>
        </Paper>
        <Menu
          shadow="md"
          width={200}
          closeOnItemClick={false}
          opened={opened}
          onChange={setOpened}
        >
          <Menu.Target>
            <Paper radius="xs" p="xs" withBorder>
              <Group wrap="nowrap" justify="space-between">
                <Group>
                  <ThemeIcon variant="transparent">
                    {form.values.date ? <IconCalendar /> : <IconCalendar />}
                  </ThemeIcon>
                  <Text size="sm" fw={form.values.date && 700}>
                    {form.values.date
                      ? "Due " + dayjs(form.values.date).format("ddd, DD MMMM")
                      : "Add due date"}
                  </Text>
                </Group>
                {form.values.date && (
                  <ActionIcon
                    variant="transparent"
                    onClick={() => {
                      form.setFieldValue("date", false);
                      setOpened(false);
                    }}
                  >
                    <IconX />
                  </ActionIcon>
                )}
              </Group>
            </Paper>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item ta="center" disabled>
              Due
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item
              leftSection={<IconCalendarCheck />}
              rightSection={<Text>{days[dayjs().day()]}</Text>}
              onClick={() => handleSelect(dayjs().format("MM-DD-YYYY"))}
            >
              Today
            </Menu.Item>
            <Menu.Item
              leftSection={<IconCalendarUp />}
              rightSection={<Text>{days[dayjs().add(1, "day").day()]}</Text>}
              onClick={() =>
                handleSelect(dayjs().add(1, "day").format("MM-DD-YYYY"))
              }
            >
              Tomorrow
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item leftSection={<IconCalendarTime />}>
              <Popover position="bottom" withArrow shadow="md">
                <Popover.Target>
                  <Text>Pick a date</Text>
                </Popover.Target>
                <Popover.Dropdown>
                  <Calendar
                    getDayProps={(date) => ({
                      onClick: () =>
                        handleSelect(dayjs(date).format("MM-DD-YYYY")),
                    })}
                  />
                </Popover.Dropdown>
              </Popover>
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
        <Paper radius="xs" p="xs" withBorder>
          <Group
            wrap="nowrap"
            justify="space-between"
            style={{ whiteSpace: "nowrap" }}
          >
            <ThemeIcon variant="transparent">
              <IconTag />
            </ThemeIcon>
            <MultiSelect
              searchable
              placeholder="Pick a category"
              data={categories}
              {...form.getInputProps("category")}
              styles={{
                root: {
                  width: "100%",
                },
                input: {
                  backgroundColor: "transparent",
                  outline: 0,
                  border: 0,
                  borderStyle: "none",
                  paddingLeft: 0,
                },
                section: {
                  display: "none",
                },
              }}
            />
          </Group>
        </Paper>
        <Paper radius="xs" p="xs" withBorder>
          <Group
            wrap="nowrap"
            justify="space-between"
            style={{ whiteSpace: "nowrap" }}
          >
            <Textarea
              placeholder="Add note"
              {...form.getInputProps("notes")}
              styles={{
                root: {
                  width: "100%",
                },
                input: {
                  backgroundColor: "transparent",
                  outline: 0,
                  border: 0,
                  borderStyle: "none",
                  paddingLeft: 0,
                },
                section: {
                  display: "none",
                },
              }}
            />
          </Group>
        </Paper>
        <Group mt="xs" justify="space-between">
          <Button
            leftSection={<IconX size={18} />}
            onClick={() => setEdit(null)}
            color="red"
          >
            Cancel
          </Button>
          <Button
            leftSection={<IconSend size={18} />}
            type="submit"
            color="green"
          >
            Update
          </Button>
        </Group>
      </Stack>
    </form>
  );
};

export default EditTodo;
