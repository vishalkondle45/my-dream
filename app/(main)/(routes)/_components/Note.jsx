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

const Note = ({ note, setEdit, edit, open, close, value }) => {
  const { hovered, ref } = useHover();

  const trash = useMutation(api.notes.trash);
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

  const onTrash = async () => {
    if (!note?._id) return;
    const id = notifications.show({
      title: "Archiving a note?...",
      loading: true,
      withBorder: true,
      autoClose: false,
      withCloseButton: false,
    });
    await trash({ _id: note?._id })
      .then((res) => {
        notifications.update({
          id,
          title: "Note trashed!",
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

  return (
    <Paper
      bg={`${note?.color}`}
      p="md"
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
          <Text fw={700} fz="lg">
            {note?.title}
          </Text>
          <Text opacity={Boolean(hovered)}>{note?.note}</Text>
        </Box>
        {hovered && !note?.isTrashed && (
          <ActionIcon
            onClick={note?.isPinned ? onUnPin : onPin}
            radius="xl"
            variant={note.color ? "filled" : "transparent"}
            color={note.color}
            title={note?.isPinned ? "Unpin" : "Pin"}
          >
            {note?.isPinned ? <IconPinnedFilled /> : <IconPinned />}
          </ActionIcon>
        )}
      </Group>
      {
        <Group justify="space-between" opacity={Number(hovered)}>
          {note?.isTrashed ? (
            <ActionIcon
              radius="xl"
              onClick={onRestore}
              variant={note.color ? "filled" : "transparent"}
              color={note.color}
              title="Restore"
            >
              <IconRestore />
            </ActionIcon>
          ) : (
            <>
              <ActionIcon
                onClick={onEdit}
                radius="xl"
                variant={note.color ? "filled" : "transparent"}
                color={note.color}
                title="Edit"
              >
                <IconPencil />
              </ActionIcon>
              <ActionIcon
                onClick={() => onClone(note?.title, note?.note, note?.color)}
                radius="xl"
                variant={note.color ? "filled" : "transparent"}
                color={note.color}
                title="Clone"
              >
                <IconCopy />
              </ActionIcon>
              <ActionIcon
                onClick={() => {}}
                radius="xl"
                variant={note.color ? "filled" : "transparent"}
                color={note.color}
                title="Copy to docs"
              >
                <IconFileText />
              </ActionIcon>
            </>
          )}
          <ActionIcon
            radius="xl"
            variant={note.color ? "filled" : "transparent"}
            color={note.color}
            title={note?.isTrashed ? "Delete permanently" : "Move to trash"}
            onClick={note?.isTrashed ? onRemove : onTrash}
          >
            <IconTrash />
          </ActionIcon>
        </Group>
      }
    </Paper>
  );
};

export default Note;
