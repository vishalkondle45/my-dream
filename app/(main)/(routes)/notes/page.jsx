"use client";
import { api } from "@/convex/_generated/api";
import { Button, SimpleGrid } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { useMutation, useQuery } from "convex/react";
import React, { useState } from "react";
import Note from "../_components/Note";
import { useDisclosure } from "@mantine/hooks";
import EditNote from "../_components/EditNote";
import NewNote from "../_components/NewNote";

const Page = () => {
  const [edit, setEdit] = useState({ title: "", note: "" });
  const [newNote, setNewNote] = useState({ title: "", note: "", color: "" });
  const [opened, { open, close }] = useDisclosure(false);
  const [opened1, { open: open1, close: close1 }] = useDisclosure(false);

  let notes = useQuery(api.notes.get);

  return (
    <div>
      <Button
        leftSection={<IconPlus size={16} />}
        onClick={() => {
          open1();
        }}
        mb="md"
      >
        Create Note
      </Button>
      <SimpleGrid cols={{ base: 1, xs: 1, sm: 2, md: 3, lg: 3, xl: 4 }}>
        {notes?.map((note) => (
          <Note
            open={open}
            close={close}
            edit={edit}
            setEdit={setEdit}
            key={note._id}
            note={note}
          />
        ))}
      </SimpleGrid>
      {edit?._id && (
        <>
          <EditNote
            opened={opened}
            setEdit={setEdit}
            edit={edit}
            close={close}
          />
        </>
      )}
      {opened1 && (
        <>
          <NewNote
            newNote={newNote}
            setNewNote={setNewNote}
            opened={opened1}
            setEdit={setEdit}
            edit={edit}
            close={close1}
          />
        </>
      )}
    </div>
  );
};

export default Page;
