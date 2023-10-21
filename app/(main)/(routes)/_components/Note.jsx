import { api } from "@/convex/_generated/api";
import { ActionIcon, Box, Checkbox, Group, Paper, Text } from "@mantine/core";
import { useHover } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import {
  IconCheck,
  IconCopy,
  IconFileText,
  IconPencil,
  IconPinned,
  IconPinnedFilled,
  IconRestore,
  IconTrash,
} from "@tabler/icons-react";
import { useMutation } from "convex/react";
import React from "react";

const Note = ({ note, setEdit, edit, open, close, value }) => {
  const { hovered, ref } = useHover();

  const archive = useMutation(api.notes.archive);
  const restore = useMutation(api.notes.restore);
  const remove = useMutation(api.notes.remove);
  const pin = useMutation(api.notes.pin);
  const unpin = useMutation(api.notes.unpin);
  const create = useMutation(api.notes.create);

  const onClone = async (title, note, color) => {
    const id = notifications.show({
      title: "Cloning a note?...",
      loading: true,
      withBorder: true,
      autoClose: false,
      withCloseButton: false,
    });
    await create({ title, note, color })
      .then((res) => {
        notifications.update({
          id,
          title: "Note cloned!",
          icon: <IconCheck size={16} />,
          color: "green",
          withBorder: true,
          loading: false,
          autoClose: 2000,
        });
      })
      .catch((error) => console.log(error));
  };

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

  const onPin = async () => {
    if (!note?._id) return;
    const id = notifications.show({
      title: "Pinning a note?...",
      loading: true,
      withBorder: true,
      autoClose: false,
      withCloseButton: false,
    });
    await pin({ value: [note?._id] })
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

  return (
    <Paper
      bg={`${note?.color || "dark"}`}
      c="white"
      p="md"
      radius="md"
      withBorder
      ref={ref}
      shadow={hovered && "xl"}
    >
      {(hovered || value?.includes(note._id)) && value && (
        <Checkbox
          key={note._id}
          styles={{ root: { position: "relative", left: -24, top: -24 } }}
          value={note._id}
          mb={"-lg"}
        />
      )}
      <Group justify="space-between" align="flex-start" wrap="nowrap">
        <Box mih={80}>
          <Text fw={700}>{note?.title}</Text>
          <Text>{note?.note}</Text>
        </Box>
        {hovered && !note?.isArchived && (
          <ActionIcon
            onClick={note?.isPinned ? onUnPin : onPin}
            radius="xl"
            variant="subtle"
            color="white"
            title={note?.isPinned ? "Unpin" : "Pin"}
          >
            {note?.isPinned ? <IconPinnedFilled /> : <IconPinned />}
          </ActionIcon>
        )}
      </Group>
      {hovered && (
        <Group mt="md" justify="space-between">
          {note?.isArchived ? (
            <ActionIcon
              color="white"
              radius="xl"
              onClick={onRestore}
              variant="subtle"
              title="Restore"
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
                title="Edit"
              >
                <IconPencil />
              </ActionIcon>
              <ActionIcon
                onClick={() => onClone(note?.title, note?.note, note?.color)}
                color="white"
                radius="xl"
                variant="subtle"
                title="Clone"
              >
                <IconCopy />
              </ActionIcon>
              <ActionIcon
                onClick={() => {}}
                color="white"
                radius="xl"
                variant="subtle"
                title="Copy to docs"
              >
                <IconFileText />
              </ActionIcon>
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
      )}
    </Paper>
  );
};

export default Note;
