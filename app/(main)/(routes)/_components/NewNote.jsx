import React from "react";
import {
  Modal,
  TextInput,
  Textarea,
  getThemeColor,
  rem,
  Group,
  useMantineTheme,
  Button,
  ActionIcon,
  CheckIcon,
} from "@mantine/core";
import {
  IconAsteriskSimple,
  IconCheck,
  IconCloudUpload,
  IconX,
} from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

const NewNote = ({ newNote, setNewNote, close, opened }) => {
  const theme = useMantineTheme();
  const create = useMutation(api.notes.create);

  const onCreate = async () => {
    if (!newNote?.note) {
      notifications.show({
        title: "Note is required field.",
        withBorder: true,
        autoClose: 2000,
        withCloseButton: false,
        icon: <IconAsteriskSimple size={16} />,
        color: "red",
      });
      return;
    }
    const id = notifications.show({
      title: "Updating a note...",
      loading: true,
      withBorder: true,
      autoClose: false,
      withCloseButton: false,
    });
    await create({ title: edit.title, note: edit.note })
      .then((res) => {
        notifications.update({
          id,
          title: "Note updated!",
          icon: <IconCheck size={16} />,
          color: "green",
          withBorder: true,
          loading: false,
          autoClose: 2000,
        });
        setNewNote({ title: "", note: "" });
      })
      .catch((error) => console.log(error))
      .finally(() => {
        setNewNote({ title: "", note: "" });
        close();
      });
  };
  return (
    <Modal
      opened={opened}
      withCloseButton={false}
      centered
      styles={{
        body: {
          padding: 0,
          backgroundColor:
            newNote?.color && getThemeColor(`${newNote?.color}.6`, theme),
        },
      }}
      onClose={() => setNewNote({ title: "", note: "" })}
    >
      <TextInput
        value={newNote?.title}
        onChange={(e) =>
          setNewNote({ ...newNote, title: e.currentTarget.value })
        }
        placeholder="Title"
        styles={{
          input: {
            backgroundColor:
              newNote?.color && getThemeColor(`${newNote?.color}.6`, theme),
            outline: 0,
            border: 0,
            borderStyle: "none",
            fontWeight: 700,
            color: "black",
            fontSize: rem(16),
          },
          wrapper: {
            backgroundColor:
              newNote?.color && getThemeColor(`${newNote?.color}.6`, theme),
          },
        }}
      />
      <Textarea
        rows={5}
        value={newNote?.note}
        onChange={(e) =>
          setNewNote({ ...newNote, note: e.currentTarget.value })
        }
        placeholder="Note"
        styles={{
          input: {
            backgroundColor:
              newNote?.color && getThemeColor(`${newNote?.color}.6`, theme),
            outline: 0,
            border: 0,
            borderStyle: "none",
            color: "black",
            fontSize: rem(16),
          },
          wrapper: {
            backgroundColor:
              newNote?.color && getThemeColor(`${newNote?.color}.6`, theme),
          },
        }}
      />
      <Group justify="flex-start" px="md">
        {Object.keys(theme.colors).map((color) => (
          <ActionIcon
            key={color}
            color={`${color}`}
            size="sm"
            radius="xl"
            variant="filled"
            onClick={() =>
              newNote.color === color
                ? setNewNote({ ...newNote, color: "" })
                : setNewNote({ ...newNote, color })
            }
            styles={{
              root: {
                borderWidth: 1,
                borderColor: "white",
              },
            }}
          >
            {newNote?.color == color && <CheckIcon size={12} />}
          </ActionIcon>
        ))}
      </Group>
      <Group justify="space-between" px="md" py="xs">
        <Button
          onClick={() => {
            close();
            setNewNote({ title: "", note: "", color: "" });
          }}
          leftSection={<IconX />}
          variant="default"
        >
          Cancel
        </Button>
        <Button
          onClick={onCreate}
          leftSection={<IconCloudUpload />}
          variant="default"
        >
          Create
        </Button>
      </Group>
    </Modal>
  );
};

export default NewNote;
