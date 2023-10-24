"use client";
import { api } from "@/convex/_generated/api";
import { Box } from "@mantine/core";
import { useQuery } from "convex/react";
import NewTodo from "../_components/NewTodo";
import Todo from "../_components/Todo";
import TodoHeader from "../_components/TodoHeader";

const Page = () => {
  let todos = useQuery(api.todos.get);

  return (
    <Box>
      <TodoHeader />
      <NewTodo />
      {todos?.map((todo) => (
        <Todo key={todo._id} todo={todo} />
      ))}
    </Box>
  );
};

export default Page;
