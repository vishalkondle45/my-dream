"use client";
import { api } from "@/convex/_generated/api";
import { Accordion, Box, Group, Modal, Text } from "@mantine/core";
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
import { sortMap } from "@/utils/constants";

const StaticPage = ({
  sortBy,
  reverse,
  field,
  value,
  hide,
  icon,
  header,
  not = false,
  object,
}) => {
  const [value1, setValue1] = useState(null);
  const [sort, setSort] = useState({ sortBy, reverse });
  let todos = useQuery(api.todos.get, { ...sort, field, value, not });
  const [edit, setEdit] = useState(null);

  return (
    <Box>
      <TodoHeader
        icon={icon}
        setSort={setSort}
        sortMap={sortMap}
        header={header}
      />
      <Sorting setSort={setSort} sort={sort} />
      <NewTodo object={object} />
      {todos
        ?.filter(({ completedOn }) => completedOn === "")
        ?.map((todo) => (
          <Todo
            key={todo?._id}
            todo={todo}
            setEdit={setEdit}
            edit={edit}
            hide={hide}
          />
        ))}
      {todos?.filter(({ completedOn }) => completedOn !== "")?.length ? (
        <Accordion
          px={0}
          chevronPosition="left"
          mt="xl"
          variant="default"
          value={value1}
          onChange={setValue1}
          styles={{ content: { paddingInline: 0 } }}
        >
          <Accordion.Item value="completed">
            <Accordion.Control>
              <Group>
                <Text size="sm" fw={700}>
                  Completed
                </Text>
                <Text size="sm">
                  {
                    todos?.filter(({ completedOn }) => completedOn !== "")
                      ?.length
                  }
                </Text>
              </Group>
            </Accordion.Control>
            <Accordion.Panel px={0}>
              {todos
                ?.filter(({ completedOn }) => completedOn !== "")
                ?.map((todo) => (
                  <Todo
                    key={todo?._id}
                    todo={todo}
                    setEdit={setEdit}
                    edit={edit}
                    hide="list"
                  />
                ))}
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      ) : (
        <></>
      )}
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

export default StaticPage;
