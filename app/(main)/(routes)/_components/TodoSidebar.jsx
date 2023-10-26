"use client";
import { api } from "@/convex/_generated/api";
import { Box, Button, TextInput, rem } from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconPlus } from "@tabler/icons-react";
import { useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import TodoSidebarItem from "./TodoSidebarItem";

const TodoSidebar = ({ data }) => {
  const create = useMutation(api.lists.create);
  const router = useRouter();

  const form = useForm({
    initialValues: {
      title: "",
    },
    validate: {
      title: (value) => (value.length ? null : "List name is required."),
    },
  });

  const createList = async (values) => {
    const id = notifications.show({
      title: "Creating a list...",
      loading: true,
      withBorder: true,
      autoClose: false,
      withCloseButton: false,
    });
    await create(values)
      .then((res) => {
        console.log(res);
        notifications.update({
          id,
          title: "List created!",
          icon: <IconCheck size={16} />,
          color: "green",
          withBorder: true,
          loading: false,
          autoClose: 2000,
          withCloseButton: true,
        });
        router.push(`/todos/${res}`);
      })
      .catch((error) => console.log(error))
      .finally(() => {
        form.reset();
      });
  };

  return (
    <Box
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignSelf: "start",
      }}
      pr="xl"
      w={rem(200)}
    >
      {data.map((item) => (
        <TodoSidebarItem
          icon={item.icon}
          text={item.text}
          route={item.route}
          key={item.route}
        />
      ))}

      <form onSubmit={form.onSubmit((values) => createList(values))}>
        <TextInput
          styles={{
            input: {
              backgroundColor: "transparent",
              outline: 0,
              border: 0,
              borderStyle: "none",
            },
            wrapper: { backgroundColor: "transparent" },
          }}
          leftSection={<IconPlus size={18} />}
          placeholder="New list"
          px={4}
          {...form.getInputProps("title")}
        />
        <Button type="submit" display="none">
          Submit
        </Button>
      </form>
    </Box>
  );
};

export default TodoSidebar;
