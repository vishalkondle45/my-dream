import { api } from "@/convex/_generated/api";
import {
  ActionIcon,
  CheckIcon,
  Group,
  Paper,
  Popover,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import {
  IconCheck,
  IconPencil,
  IconPinned,
  IconRestore,
  IconTrash,
} from "@tabler/icons-react";
import { useMutation } from "convex/react";
import React from "react";

const Note = ({ note }) => {
  const theme = useMantineTheme();
  const archive = useMutation(api.notes.archive);
  const restore = useMutation(api.notes.restore);
  const changeColor = useMutation(api.notes.changeColor);

  const onArchiveNote = async () => {
    if (!note?._id) return;
    const id = notifications.show({
      title: "Archiving a note?...",
      loading: true,
      withBorder: true,
      autoClose: false,
      withCloseButton: false,
    });
    await archive({ _id: note?._id })
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

  const onRestoreNote = async () => {
    if (!note?._id) return;
    const id = notifications.show({
      title: "Restoring a note?...",
      loading: true,
      withBorder: true,
      autoClose: false,
      withCloseButton: false,
    });
    await restore({ _id: note?._id })
      .then((res) => {
        notifications.update({
          id,
          title: "Note restored!",
          icon: <IconCheck size={16} />,
          color: "green",
          withBorder: true,
          loading: false,
          autoClose: 2000,
        });
      })
      .catch((error) => console.log(error));
  };

  const onColorChange = async (color) => {
    if (!note?._id) return;
    const id = notifications.show({
      title: "coloring a note?...",
      loading: true,
      withBorder: true,
      autoClose: false,
      withCloseButton: false,
    });
    await changeColor({ _id: note?._id, color })
      .then((res) => {
        notifications.update({
          id,
          title: "Note colored!",
          icon: <IconCheck size={16} />,
          color: "green",
          withBorder: true,
          loading: false,
          autoClose: 2000,
        });
      })
      .catch((error) => console.log(error));
  };

  const swatches = Object.keys(theme.colors).map((color) => (
    <ActionIcon
      key={color}
      color={`${color}`}
      size="sm"
      radius="xl"
      variant="filled"
      onClick={() => onColorChange(color)}
    >
      {note?.color == color ? <CheckIcon size={12} /> : <></>}
    </ActionIcon>
  ));

  return (
    <Paper bg={`${note?.color}.9`} p="md" radius="md" withBorder>
      <Group justify="space-between">
        <Text fw={700}>{note?.title}</Text>
        {note?.isArchived || (
          <ActionIcon variant="transparent">
            <IconPinned />
          </ActionIcon>
        )}
      </Group>
      <Text>{note?.note}</Text>
      <Group mt="md" justify="space-between">
        {note?.isArchived ? (
          <ActionIcon onClick={onRestoreNote} variant="transparent">
            <IconRestore />
          </ActionIcon>
        ) : (
          <>
            <ActionIcon variant="transparent">
              <IconPencil />
            </ActionIcon>
          </>
        )}
        {!note?.isArchived && (
          <Popover width={285} position="bottom" withArrow shadow="md">
            <Popover.Target>
              <ActionIcon
                color={note?.color}
                size="sm"
                radius="xl"
                styles={{
                  root: {
                    borderColor: "white",
                    borderWidth: 2,
                  },
                }}
              ></ActionIcon>
            </Popover.Target>
            <Popover.Dropdown>
              <Group>{swatches}</Group>
            </Popover.Dropdown>
          </Popover>
        )}
        <ActionIcon onClick={onArchiveNote} variant="transparent">
          <IconTrash />
        </ActionIcon>
      </Group>
    </Paper>
  );
};

export default Note;
