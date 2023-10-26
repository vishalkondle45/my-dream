"use client";
import { api } from "@/convex/_generated/api";
import { Center, Loader } from "@mantine/core";
import { useQuery } from "convex/react";
import { useState } from "react";
import Sorting from "../../_components/Sorting";
import Todo from "../../_components/Todo";
import TodoHeader_ from "../../_components/TodoHeader_";

const Page = ({ params }) => {
  const [edit, setEdit] = useState(null);
  const [sort, setSort] = useState({
    sortBy: "isImportant",
    reverse: false,
  });

  let lists = useQuery(api?.lists?.get);
  const list = lists?.find((list) => list?._id === params?.list_id);
  let todos = useQuery(api?.todos?.getByList, { list: list?._id, ...sort });

  if (!todos || !lists) {
    return (
      <Center>
        <Loader type="bars" />
      </Center>
    );
  }

  return (
    <div>
      <TodoHeader_ queryParams={params} list={list} setSort={setSort} />
      <Sorting setSort={setSort} sort={sort} />
      {todos?.map((todo) => (
        <Todo
          key={todo._id}
          todo={todo}
          setEdit={setEdit}
          edit={edit}
          color={list?.color}
        />
      ))}
    </div>
  );
};

export default Page;
