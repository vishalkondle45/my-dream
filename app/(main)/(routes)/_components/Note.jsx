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
  IconColorSwatch,
  IconPencil,
  IconPinned,
  IconPinnedFilled,
  IconRestore,
  IconTrash,
  IconX,
} from "@tabler/icons-react";
import { useMutation } from "convex/react";
import React from "react";

const Note = ({ note, setEdit, edit, open, close }) => {
  const theme = useMantineTheme();

  const archive = useMutation(api.notes.archive);
  const restore = useMutation(api.notes.restore);
  const remove = useMutation(api.notes.remove);
  const changeColor = useMutation(api.notes.changeColor);
  const pin = useMutation(api.notes.pin);
  const unpin = useMutation(api.notes.unpin);

  const onArchive = async () => {
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

  const onRestore = async () => {
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

  const onRemove = async () => {
    if (!note?._id) return;
    const id = notifications.show({
      title: "Removing a note?...",
      loading: true,
      withBorder: true,
      autoClose: false,
      withCloseButton: false,
    });
    await remove({ _id: note?._id })
      .then((res) => {
        notifications.update({
          id,
          title: "Note removed!",
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

  const onPin = async () => {
    if (!note?._id) return;
    const id = notifications.show({
      title: "Pinning a note?...",
      loading: true,
      withBorder: true,
      autoClose: false,
      withCloseButton: false,
    });
    await pin({ _id: note?._id })
      .then((res) => {
        notifications.update({
          id,
          title: "Note pinned!",
          icon: <IconCheck size={16} />,
          color: "green",
          withBorder: true,
          loading: false,
          autoClose: 2000,
        });
      })
      .catch((error) => console.log(error));
  };

  const onUnPin = async () => {
    if (!note?._id) return;
    const id = notifications.show({
      title: "Unpinning a note?...",
      loading: true,
      withBorder: true,
      autoClose: false,
      withCloseButton: false,
    });
    await unpin({ _id: note?._id })
      .then((res) => {
        notifications.update({
          id,
          title: "Note unpinned!",
          icon: <IconCheck size={16} />,
          color: "green",
          withBorder: true,
          loading: false,
          autoClose: 2000,
        });
      })
      .catch((error) => console.log(error));
  };

  const onEdit = () => {
    if (edit?._id !== note?._id) {
      setEdit(note);
      open();
    } else {
      setEdit({ title: "", note: "" });
      close();
    }
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
    <Paper bg={`${note?.color}.6`} c="white" p="md" radius="md" withBorder>
      <Group justify="space-between">
        <Text fw={700}>{note?.title}</Text>
        {note?.isArchived || (
          <ActionIcon
            onClick={note?.isPinned ? onUnPin : onPin}
            radius="xl"
            variant="subtle"
            color="white"
          >
            {note?.isPinned ? <IconPinnedFilled /> : <IconPinned />}
          </ActionIcon>
        )}
      </Group>
      <Text>{note?.note}</Text>
      <Group mt="md" justify="space-between">
        {note?.isArchived ? (
          <ActionIcon
            color="white"
            radius="xl"
            onClick={onRestore}
            variant="subtle"
          >
            <IconRestore />
          </ActionIcon>
        ) : (
          <>
            <ActionIcon
              onClick={onEdit}
              color="white"
              radius="xl"
              variant="subtle"
            >
              <IconPencil />
            </ActionIcon>

            <Popover width={285} position="bottom" withArrow shadow="md">
              <Popover.Target>
                <ActionIcon color="white" radius="xl" variant="subtle">
                  <IconColorSwatch />
                </ActionIcon>
              </Popover.Target>
              <Popover.Dropdown>
                <Group>{swatches}</Group>
              </Popover.Dropdown>
            </Popover>
          </>
        )}
        <ActionIcon
          radius="xl"
          variant="subtle"
          color="white"
          onClick={note?.isArchived ? onRemove : onArchive}
        >
          <IconTrash />
        </ActionIcon>
      </Group>
    </Paper>
  );
};

export default Note;
