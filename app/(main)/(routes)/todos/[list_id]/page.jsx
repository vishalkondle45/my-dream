"use client";
import { api } from "@/convex/_generated/api";
import {
  Accordion,
  Center,
  Group,
  LoadingOverlay,
  Modal,
  Text,
} from "@mantine/core";
import { useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import EditTodo from "../../_components/EditTodo";
import NewTodo from "../../_components/NewTodo";
import Sorting from "../../_components/Sorting";
import Todo from "../../_components/Todo";
import TodoHeader_ from "../../_components/TodoHeader_";

const Page = ({ params }) => {
  const [value, setValue] = useState(null);
  const [edit, setEdit] = useState(null);
  const [sort, setSort] = useState({
    sortBy: "isImportant",
    reverse: false,
  });
  const router = useRouter();

  let lists = useQuery(api?.lists?.get);
  const list = lists?.find((list) => list?._id === params?.list_id);

  useEffect(() => {
    if (!list) {
      router.push("/todos");
    }
  }, [list]);

  let todos = useQuery(api?.todos?.getByList, { list: list?._id, ...sort });

  if (!todos || !lists) {
    return (
      <Center>
        <LoadingOverlay visible={true} />
      </Center>
    );
  }

  return (
    <div>
      <TodoHeader_ queryParams={params} list={list} setSort={setSort} />
      <Sorting setSort={setSort} sort={sort} />
      <NewTodo object={{ list: list?._id }} />
      {todos
        ?.filter(({ completedOn }) => completedOn === "")
        ?.map((todo) => (
          <Todo
            key={todo?._id}
            todo={todo}
            setEdit={setEdit}
            edit={edit}
            color={list?.color}
            hide="list"
          />
        ))}
      {todos?.filter(({ completedOn }) => completedOn !== "")?.length ? (
        <Accordion
          px={0}
          chevronPosition="left"
          mt="xl"
          variant="default"
          value={value}
          onChange={setValue}
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
                    color={list?.color}
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
    </div>
  );
};

export default Page;
