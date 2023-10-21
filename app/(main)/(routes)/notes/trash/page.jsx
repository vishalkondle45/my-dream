"use client";
import { api } from "@/convex/_generated/api";
import { Button, Group, SimpleGrid } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconRestore, IconTrash, IconX } from "@tabler/icons-react";
import { useMutation, useQuery } from "convex/react";
import React from "react";
import Note from "../../_components/Note";

const Page = () => {
  let notes = useQuery(api.notes.getTrash);
  const empty = useMutation(api.notes.empty);
  const restoreAll = useMutation(api.notes.restoreAll);

  const onEmpty = async () => {
    if (!notes.length) {
      notifications.show({
        title: "Trash is empty...",
        loading: false,
        withBorder: true,
        autoClose: 2000,
        withCloseButton: true,
        icon: <IconX />,
        color: "red",
      });
      return;
    }
    const id = notifications.show({
      title: "Deleting all notes in archive...",
      loading: true,
      withBorder: true,
      autoClose: false,
      withCloseButton: false,
    });
    await empty()
      .then((res) => {
        notifications.update({
          id,
          title: "All archive notes deleted!",
          icon: <IconCheck size={16} />,
          color: "green",
          withBorder: true,
          loading: false,
          autoClose: 2000,
        });
      })
      .catch((error) => console.log(error));
  };
  const onRestoreAll = async () => {
    if (!notes.length) {
      notifications.show({
        title: "Trash is empty...",
        loading: false,
        withBorder: true,
        autoClose: 2000,
        withCloseButton: true,
        icon: <IconX />,
        color: "red",
      });
      return;
    }
    const id = notifications.show({
      title: "Restoring all notes in archive...",
      loading: true,
      withBorder: true,
      autoClose: false,
      withCloseButton: false,
    });
    await restoreAll()
      .then((res) => {
        notifications.update({
          id,
          title: "All notes restored!",
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
      <Group>
        <Button onClick={onEmpty} mb="md" leftSection={<IconTrash size={16} />}>
          Delete all
        </Button>
        <Button
          onClick={onRestoreAll}
          mb="md"
          leftSection={<IconRestore size={16} />}
        >
          Restore all
        </Button>
      </Group>
      <SimpleGrid
        cols={{ base: 1, xs: 2, sm: 2, md: 3, lg: 3, xl: 4 }}
        mb="xl"
        styles={{
          root: {
            alignItems: "flex-start",
          },
        }}
      >
        {notes?.map((note) => (
          <Note key={note._id} note={note} />
        ))}
      </SimpleGrid>
    </div>
  );
};

export default Page;
