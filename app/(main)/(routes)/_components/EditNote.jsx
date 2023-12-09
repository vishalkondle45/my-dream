import { api } from "@/convex/_generated/api";
import {
  ActionIcon,
  Button,
  CheckIcon,
  Group,
  Modal,
  TextInput,
  Textarea,
  getThemeColor,
  rem,
  useMantineTheme,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconCloudUpload, IconX } from "@tabler/icons-react";
import { useMutation } from "convex/react";

const EditNote = ({ edit, setEdit, close, opened }) => {
  const theme = useMantineTheme();
  const update = useMutation(api.notes.update);

  const onUpdate = async () => {
    if (!edit._id) return;
    const id = notifications.show({
      title: "Updating a note?...",
      loading: true,
      withBorder: true,
      autoClose: false,
      withCloseButton: false,
    });
    await update({
      _id: edit._id,
      title: edit.title,
      note: edit.note,
      color: edit.color,
    })
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
        setEdit({ title: "", note: "" });
      })
      .catch((error) => console.log(error))
      .finally(() => {
        setEdit({ title: "", note: "" });
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
            edit?.color && getThemeColor(`${edit?.color}`, theme),
        },
      }}
      onClose={() => setEdit({ title: "", note: "" })}
    >
      <TextInput
        value={edit?.title}
        onChange={(e) => setEdit({ ...edit, title: e.currentTarget.value })}
        placeholder="Title"
        radius={0}
        styles={{
          input: {
            backgroundColor:
              edit?.color && getThemeColor(`${edit?.color}`, theme),
            outline: 0,
            border: 0,
            borderStyle: "none",
            fontWeight: 700,
            fontSize: rem(16),
          },
          wrapper: {
            backgroundColor:
              edit?.color && getThemeColor(`${edit?.color}`, theme),
          },
        }}
      />
      <Textarea
        rows={10}
        value={edit?.note}
        onChange={(e) => setEdit({ ...edit, note: e.currentTarget.value })}
        radius={0}
        styles={{
          input: {
            backgroundColor:
              edit?.color && getThemeColor(`${edit?.color}`, theme),
            outline: 0,
            border: 0,
            borderStyle: "none",
            fontSize: rem(16),
          },
          wrapper: {
            backgroundColor:
              edit?.color && getThemeColor(`${edit?.color}`, theme),
          },
        }}
      />
      <Group justify="flex-start" p="md">
        {Object.keys(theme.colors)
          ?.filter((color) => color !== "dark")
          .map((color) => (
            <ActionIcon
              key={color}
              color={`${color}`}
              size="sm"
              radius="xl"
              variant="filled"
              onClick={() =>
                edit?.color === color
                  ? setEdit({ ...edit, color: undefined })
                  : setEdit({ ...edit, color })
              }
              styles={{
                root: {
                  borderWidth: 1,
                  borderColor: "white",
                },
              }}
            >
              {edit?.color == color && <CheckIcon size={12} />}
            </ActionIcon>
          ))}
      </Group>
      <Group justify="space-between" px="md" py="xs">
        <Button
          onClick={() => setEdit({ title: "", note: "" })}
          leftSection={<IconX />}
        >
          Cancel
        </Button>
        <Button onClick={onUpdate} leftSection={<IconCloudUpload />}>
          Update
        </Button>
      </Group>
    </Modal>
  );
};

export default EditNote;
