"use client";
import { api } from "@/convex/_generated/api";
import { Box, Button, Container, Group, Modal } from "@mantine/core";
import { useQuery } from "convex/react";
import NewTodo from "../_components/NewTodo";
import Todo from "../_components/Todo";
import TodoHeader from "../_components/TodoHeader";
import EditTodo from "../_components/EditTodo";
import { useState } from "react";
import { IconAbacusOff, IconSend, IconX } from "@tabler/icons-react";

const Page = () => {
  let todos = useQuery(api.todos.get);
  const [edit, setEdit] = useState(null);

  return (
    <Box>
      <TodoHeader />
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
