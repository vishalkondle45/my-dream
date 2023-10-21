"use client";
import { api } from "@/convex/_generated/api";
import {
  ActionIcon,
  Button,
  Checkbox,
  Flex,
  Group,
  Popover,
  SimpleGrid,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import {
  IconCheck,
  IconCopy,
  IconFileText,
  IconPalette,
  IconPinnedFilled,
  IconPlus,
  IconTrash,
  IconX,
} from "@tabler/icons-react";
import { useMutation, useQuery } from "convex/react";
import { useState } from "react";
import EditNote from "../_components/EditNote";
import NewNote from "../_components/NewNote";
import Note from "../_components/Note";

const Page = () => {
  const theme = useMantineTheme();
  const [value, setValue] = useState([]);
  const [edit, setEdit] = useState({ title: "", note: "" });
  const [newNote, setNewNote] = useState({
    title: "",
    note: "",
  });
  const [opened, { open, close }] = useDisclosure(false);
  const [opened1, { open: open1, close: close1 }] = useDisclosure(false);

  let notes = useQuery(api.notes.get);
  let colorSelected = useMutation(api.notes.colorSelected);
  let pinSelected = useMutation(api.notes.pinSelected);
  let archiveSelected = useMutation(api.notes.archiveSelected);
  let cloneSelected = useMutation(api.notes.cloneSelected);

  const onPinSelected = async () => {
    if (!value.length) return;
    const id = notifications.show({
      title: "Pinning notes...",
      loading: true,
      withBorder: true,
      autoClose: false,
      withCloseButton: false,
    });
    await pinSelected({ notes: value })
      .then((res) => {
        notifications.update({
          id,
          title: "Notes pinned!",
          icon: <IconCheck size={16} />,
          color: "green",
          withBorder: true,
          loading: false,
          autoClose: 2000,
        });
        setValue([]);
      })
      .catch((error) => console.log(error));
  };
  const onColorSelected = async (color) => {
    if (!value.length) return;
    const id = notifications.show({
      title: "Coloring notes...",
      loading: true,
      withBorder: true,
      autoClose: false,
      withCloseButton: false,
    });
    await colorSelected({ notes: value, color })
      .then((res) => {
        notifications.update({
          id,
          title: "Notes coloured!",
          icon: <IconCheck size={16} />,
          color: "green",
          withBorder: true,
          loading: false,
          autoClose: 2000,
        });
        setValue([]);
      })
      .catch((error) =>
        notifications.update({
          id,
          title: "Error",
          icon: <IconX size={16} />,
          color: "red",
          withBorder: true,
          loading: false,
          autoClose: 2000,
        })
      );
  };
  const onArchiveSelected = async () => {
    if (!value.length) return;
    const id = notifications.show({
      title: "Archiving notes...",
      loading: true,
      withBorder: true,
      autoClose: false,
      withCloseButton: false,
    });
    await archiveSelected({ notes: value })
      .then((res) => {
        notifications.update({
          id,
          title: "Notes Archived!",
          icon: <IconCheck size={16} />,
          color: "green",
          withBorder: true,
          loading: false,
          autoClose: 2000,
        });
        setValue([]);
      })
      .catch((error) => console.log(error));
  };
  const onCloneSelected = async () => {
    const id = notifications.show({
      title: "Cloning a note?...",
      loading: true,
      withBorder: true,
      autoClose: false,
      withCloseButton: false,
    });
    await cloneSelected({ notes: value })
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
        setValue([]);
      })
      .catch((error) => console.log(error));
  };

  const swatches = Object.keys(theme.colors)
    .filter((color) => color !== "dark")
    .map((color) => (
      <ActionIcon
        color={color}
        key={color}
        size="sm"
        radius="xl"
        variant="filled"
        onClick={() => onColorSelected(color)}
      ></ActionIcon>
    ));

  return (
    <div>
      <Group justify="space-between" mb="md">
        {value.length === 0 ? (
          <Button
            leftSection={<IconPlus size={16} />}
            onClick={() => {
              open1();
            }}
          >
            Create Note
          </Button>
        ) : (
          <>
            <Text fw={700} fz="xl">
              {value.length} Selected
            </Text>
            <Group justify="right">
              <ActionIcon onClick={onPinSelected} variant="transparent">
                <IconPinnedFilled />
              </ActionIcon>
              <Popover position="bottom-end" withArrow shadow="xl">
                <Popover.Target>
                  <ActionIcon variant="transparent">
                    <IconPalette />
                  </ActionIcon>
                </Popover.Target>
                <Popover.Dropdown>
                  <Flex
                    mih={50}
                    w={250}
                    gap="md"
                    justify="flex-start"
                    align="flex-start"
                    direction="row"
                    wrap="wrap"
                  >
                    {swatches}
                  </Flex>
                </Popover.Dropdown>
              </Popover>
              <ActionIcon variant="transparent" onClick={onArchiveSelected}>
                <IconTrash />
              </ActionIcon>
              <ActionIcon
                radius="xl"
                title="Clone"
                variant="transparent"
                onClick={onCloneSelected}
              >
                <IconCopy />
              </ActionIcon>
              <ActionIcon
                onClick={() => {}}
                radius="xl"
                title="Copy to docs"
                variant="transparent"
              >
                <IconFileText />
              </ActionIcon>
            </Group>
          </>
        )}
      </Group>
      <Checkbox.Group value={value} onChange={setValue}>
        <Text tt="uppercase" fw={700} mb="xs" fz="xs">
          Pinned
        </Text>
        <SimpleGrid
          cols={{ base: 1, xs: 1, sm: 2, md: 3, lg: 3, xl: 4 }}
          styles={{
            root: {
              alignItems: "flex-start",
            },
          }}
        >
          {notes
            ?.filter(({ isPinned }) => isPinned)
            .map((note) => (
              <Note
                open={open}
                close={close}
                edit={edit}
                setEdit={setEdit}
                key={note._id}
                note={note}
                value={value}
              />
            ))}
        </SimpleGrid>
        <Text tt="uppercase" fw={700} fz="xs" mb="xs" mt="xl">
          Others
        </Text>
        <SimpleGrid
          cols={{ base: 1, xs: 1, sm: 2, md: 3, lg: 3, xl: 4 }}
          styles={{
            root: {
              alignItems: "flex-start",
            },
          }}
        >
          {notes
            ?.filter(({ isPinned }) => !isPinned)
            .map((note) => (
              <Note
                open={open}
                close={close}
                edit={edit}
                setEdit={setEdit}
                key={note._id}
                note={note}
                value={value}
              />
            ))}
        </SimpleGrid>
      </Checkbox.Group>
      {edit?._id && (
        <>
          <EditNote
            opened={opened}
            setEdit={setEdit}
            edit={edit}
            close={close}
          />
        </>
      )}
      {opened1 && (
        <>
          <NewNote
            newNote={newNote}
            setNewNote={setNewNote}
            opened={opened1}
            setEdit={setEdit}
            edit={edit}
            close={close1}
          />
        </>
      )}
    </div>
  );
};

export default Page;
