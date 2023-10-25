"use client";
import { api } from "@/convex/_generated/api";
import { Box, Button, Modal } from "@mantine/core";
import { useMutation, useQuery } from "convex/react";
import { useState } from "react";
import EditTodo from "../_components/EditTodo";
import NewTodo from "../_components/NewTodo";
import Todo from "../_components/Todo";
import TodoHeader from "../_components/TodoHeader";
import { notifications } from "@mantine/notifications";
import { IconCheck } from "@tabler/icons-react";

const Page = () => {
  let todos = useQuery(api.todos.get);
  let create = useMutation(api.lists.create);
  const [edit, setEdit] = useState(null);

  const createList = async () => {
    const id = notifications.show({
      title: "Updating a note...",
      loading: true,
      withBorder: true,
      autoClose: false,
      withCloseButton: false,
    });
    await create({
      title: "Todo Title",
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
      })
      .catch((error) => console.log(error))
      .finally(() => {});
  };

  return (
    <Box>
      <TodoHeader />
      <Button onClick={createList}>Create List</Button>
      <NewTodo />
      {todos?.map((todo) => (
        <Todo key={todo._id} todo={todo} setEdit={setEdit} edit={edit} />
      ))}
      {todos?.length && edit && (
        <Modal
          opened={edit}
          onClose={() => setEdit(null)}
          withCloseButton={false}
          size="sm"
          closeOnEscape={false}
          closeOnClickOutside={false}
        >
          <EditTodo setEdit={setEdit} edit={edit} />
        </Modal>
      )}
    </Box>
  );
};

export default Page;
