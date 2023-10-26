"use client";
import { api } from "@/convex/_generated/api";
import { Box, Modal } from "@mantine/core";
import {
  IconCalendarEvent,
  IconCalendarTime,
  IconHome,
  IconSortAZ,
  IconStar,
} from "@tabler/icons-react";
import { useQuery } from "convex/react";
import { useState } from "react";
import EditTodo from "../_components/EditTodo";
import NewTodo from "../_components/NewTodo";
import Sorting from "../_components/Sorting";
import Todo from "../_components/Todo";
import TodoHeader from "../_components/TodoHeader";

const Page = () => {
  const [sort, setSort] = useState({
    sortBy: "isImportant",
    reverse: false,
  });
  let todos = useQuery(api.todos.get, {
    ...sort,
    field: "list",
    value: "",
  });
  const [edit, setEdit] = useState(null);
  const sortMap = [
    {
      value: "isImportant",
      label: "Imporatance",
      icon: <IconStar size={16} />,
    },
    {
      value: "date",
      label: "Due date",
      icon: <IconCalendarEvent size={16} />,
    },
    {
      value: "todo",
      label: "Alphabetically",
      icon: <IconSortAZ size={16} />,
    },
    {
      value: "_creationTime",
      label: "Creation Time",
      icon: <IconCalendarTime size={16} />,
    },
  ];

  return (
    <Box>
      <TodoHeader
        icon={<IconHome />}
        setSort={setSort}
        sortMap={sortMap}
        header="Todos"
      />
      <Sorting setSort={setSort} sort={sort} />
      <NewTodo />
      {todos?.map((todo) => (
        <Todo
          key={todo._id}
          todo={todo}
          setEdit={setEdit}
          edit={edit}
          hide="list"
        />
      ))}
      {todos?.length > 0 && edit && (
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
