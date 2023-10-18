"use client";
import { api } from "@/convex/_generated/api";
import { Button, SimpleGrid } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconTrash } from "@tabler/icons-react";
import { useMutation, useQuery } from "convex/react";
import React from "react";
import Note from "../../_components/Note";

const Page = () => {
  let notes = useQuery(api.notes.getTrash);
  const create = useMutation(api.notes.create);

  const onCreateNote = async () => {
    const id = notifications.show({
      title: "Creating a new note...",
      loading: true,
      withBorder: true,
      autoClose: false,
      withCloseButton: false,
    });
    await create({
      note: "sdklafjasj fklasj dfkljasd klfjklasdj fkljasd fklfjklasdj fklasdj fklj asdklfjasdkl fj klasdjdf l",
      title: "Title 1",
    })
      .then((res) => {
        notifications.update({
          id,
          title: "New note created!",
          icon: <IconCheck size={16} />,
          color: "green",
          withBorder: true,
          loading: false,
          autoClose: 2000,
        });
      })
      .catch((error) => console.log(error));
  };

  return (
    <div>
      <Button
        onClick={onCreateNote}
        mb="md"
        leftSection={<IconTrash size={16} />}
      >
        Delete all
      </Button>
      <SimpleGrid cols={{ base: 1, xs: 2, sm: 2, md: 3, lg: 3, xl: 4 }}>
        {notes?.map((note) => (
          <Note key={note._id} note={note} />
        ))}
      </SimpleGrid>
    </div>
  );
};

export default Page;
