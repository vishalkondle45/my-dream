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
  Popover,
} from "@mantine/core";
import {
  IconCheck,
  IconCloudUpload,
  IconColorSwatch,
  IconX,
} from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

const EditNote = ({ edit, setEdit, close, opened }) => {
  const theme = useMantineTheme();
  const update = useMutation(api.notes.update);

  const onUpdate = async () => {
    if (!edit._id) return;
    const id = notifications.show({
      title: "Updating a note...",
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
          backgroundColor: getThemeColor(`${edit?.color}.6`, theme),
        },
      }}
      onClose={() => setEdit({ title: "", note: "" })}
    >
      <TextInput
        value={edit?.title}
        onChange={(e) => setEdit({ ...edit, title: e.currentTarget.value })}
        styles={{
          input: {
            backgroundColor: getThemeColor(`${edit?.color}.6`, theme),
            outline: 0,
            border: 0,
            borderStyle: "none",
            fontWeight: 700,
            color: "white",
            fontSize: rem(16),
          },
          wrapper: {
            backgroundColor: getThemeColor(`${edit?.color}.6`, theme),
          },
        }}
      />
      <Textarea
        rows={10}
        value={edit?.note}
        onChange={(e) => setEdit({ ...edit, note: e.currentTarget.value })}
        styles={{
          input: {
            backgroundColor: getThemeColor(`${edit?.color}.6`, theme),
            outline: 0,
            border: 0,
            borderStyle: "none",
            color: "white",
            fontSize: rem(16),
          },
          wrapper: {
            backgroundColor: getThemeColor(`${edit?.color}.6`, theme),
          },
        }}
      />
      <Group justify="space-between" px="md" pb="xs">
        <Button
          onClick={() => setEdit({ title: "", note: "" })}
          leftSection={<IconX />}
          variant="white"
        >
          Cancel
        </Button>

        <Popover width={285} position="top" withArrow shadow="md">
          <Popover.Target>
            <ActionIcon
              color="white"
              radius="xl"
              variant="subtle"
              title="Color"
            >
              <IconColorSwatch />
            </ActionIcon>
          </Popover.Target>
          <Popover.Dropdown>
            <Group>
              {Object.keys(theme.colors).map((color) => (
                <ActionIcon
                  key={color}
                  color={`${color}`}
                  size="sm"
                  radius="xl"
                  variant="filled"
                  onClick={() =>
                    edit?.color === color
                      ? setEdit({ ...edit, color: "" })
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
          </Popover.Dropdown>
        </Popover>
        <Button
          onClick={onUpdate}
          leftSection={<IconCloudUpload />}
          variant="white"
        >
          Update
        </Button>
      </Group>
    </Modal>
  );
};

export default EditNote;