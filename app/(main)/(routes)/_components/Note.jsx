import { api } from "@/convex/_generated/api";
import { ActionIcon, Group, Paper, Text } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import {
  IconArchive,
  IconCheck,
  IconPencil,
  IconPinned,
  IconTrash,
} from "@tabler/icons-react";
import { useMutation } from "convex/react";
import React from "react";

const Note = ({ note }) => {
  const archive = useMutation(api.notes.archive);

  const onArchiveNote = async (e) => {
    // e.stopPropagation();
    if (!note._id) return;
    const id = notifications.show({
      title: "Archiving a note...",
      loading: true,
      withBorder: true,
      autoClose: false,
      withCloseButton: false,
    });
    await archive({ _id: note._id })
      .then((res) => {
        notifications.update({
          id,
          title: "Note archived!",
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
    <Paper bg={note.color} p="md" radius="md" withBorder>
      <Group justify="space-between">
        <Text fw={700}>{note.title}</Text>
        <ActionIcon variant="transparent">
          <IconPinned />
        </ActionIcon>
      </Group>
      <Text>{note.note}</Text>
      <Group mt="md" justify="space-between">
        <ActionIcon variant="transparent">
          <IconTrash />
        </ActionIcon>
        <ActionIcon variant="transparent">
          <IconPencil />
        </ActionIcon>
        <ActionIcon onClick={onArchiveNote} variant="transparent">
          <IconArchive />
        </ActionIcon>
      </Group>
    </Paper>
  );
};

export default Note;
