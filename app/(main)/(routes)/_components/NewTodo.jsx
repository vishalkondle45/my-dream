import { api } from "@/convex/_generated/api";
import {
  ActionIcon,
  Badge,
  Button,
  Checkbox,
  Group,
  Menu,
  Paper,
  TextInput,
} from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import {
  IconAsteriskSimple,
  IconCalendarEvent,
  IconCheck,
  IconPlus,
  IconX,
} from "@tabler/icons-react";
import { useMutation } from "convex/react";
import dayjs from "dayjs";
import { useState } from "react";

const NewTodo = ({ object }) => {
  const create = useMutation(api.todos.create);
  const [opened, setOpened] = useState(false);

  const form = useForm({
    initialValues: {
      todo: "",
      date: "",
    },
    validate: {
      todo: (value) => (value.length ? null : "Todo is required."),
    },
  });

  const onCreateTodo = async (values) => {
    if (!values?.todo) {
      notifications.show({
        title: "Todo is required field.",
        withBorder: true,
        autoClose: 2000,
        withCloseButton: false,
        icon: <IconAsteriskSimple size={16} />,
        color: "red",
      });
      return;
    }
    const id = notifications.show({
      title: "Creating a todo?...",
      loading: true,
      withBorder: true,
      autoClose: false,
      withCloseButton: false,
    });
    await create({
      todo: values?.todo,
      date: values?.date && dayjs(values?.date).format("MM-DD-YYYY"),
      ...object,
    })
      .then((res) => {
        notifications.update({
          id,
          title: "Note updated!",
          icon: <IconCheck size={16} />,
          color: "green",
          withBorder: true,
          loading: false,
          autoClose: 2000,
          withCloseButton: true,
        });
        form.reset();
      })
      .catch((error) => console.log(error))
      .finally(() => {
        form.reset();
      });
  };

  const getDayProps = (date) => {
    if (!form.values.date) {
      return {};
    }
    if (
      date?.getMonth() === form?.values?.date?.getMonth() &&
      date?.getDate() === form?.values?.date?.getDate() &&
      date?.getFullYear() === form?.values?.date?.getFullYear()
    ) {
      return {
        style: {
          backgroundColor: "var(--mantine-color-red-filled)",
          color: "var(--mantine-color-white)",
        },
      };
    }
    return {};
  };

  return (
    <Paper px="sm" py={8} mb="lg" shadow="xs" withBorder>
      <form onSubmit={form.onSubmit((values) => onCreateTodo(values))}>
        <Group gap={0} wrap="nowrap">
          <Checkbox size="xs" radius="xl" readOnly checked={false} />
          <TextInput
            w="100%"
            placeholder="Add a task"
            styles={{
              input: {
                backgroundColor: "transparent",
                outline: 0,
                border: 0,
                borderStyle: "none",
              },
              wrapper: { backgroundColor: "transparent" },
            }}
            {...form.getInputProps("todo")}
          />
          {form.values.date ? (
            <Badge
              style={{ overflow: "visible" }}
              p={1}
              mr="xs"
              rightSection={
                <ActionIcon
                  onClick={() => form.setFieldValue("date", "")}
                  radius="xl"
                  size={14}
                  color="red"
                  variant="filled"
                >
                  <IconX size={14} />
                </ActionIcon>
              }
            >
              {dayjs(form.values?.date).format("DD-MM-YYYY")}
            </Badge>
          ) : (
            <Menu
              position="bottom-end"
              shadow="md"
              opened={opened}
              onChange={setOpened}
            >
              <Menu.Target>
                <ActionIcon title="Due" mr="xs" variant="transparent">
                  <IconCalendarEvent />
                </ActionIcon>
              </Menu.Target>
              <Menu.Dropdown>
                <DatePicker
                  getDayProps={getDayProps}
                  {...form.getInputProps("date")}
                  onChange={(value) => {
                    form.setFieldValue("date", value);
                    setOpened(false);
                  }}
                />
                {form.values.date && (
                  <Button
                    color="red"
                    onClick={() => form.setFieldValue("date", "")}
                    fullWidth
                  >
                    Remove Due
                  </Button>
                )}
              </Menu.Dropdown>
            </Menu>
          )}
          <Button
            type="submit"
            size="compact-sm"
            leftSection={<IconPlus size={16} />}
          >
            Add
          </Button>
        </Group>
      </form>
    </Paper>
  );
};

export default NewTodo;
