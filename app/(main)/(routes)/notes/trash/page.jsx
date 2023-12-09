"use client";
import NotesSidebar from "@/components/navigation/NotesSidebar";
import { api } from "@/convex/_generated/api";
import { sidebarDataNotes } from "@/utils/constants";
import {
  Burger,
  Button,
  Drawer,
  Group,
  LoadingOverlay,
  SimpleGrid,
  Text,
  rem,
} from "@mantine/core";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconRestore, IconTrash, IconX } from "@tabler/icons-react";
import { useMutation, useQuery } from "convex/react";
import React from "react";
import Note from "../../_components/Note";

const Page = () => {
  let notes = useQuery(api.notes.getTrash);
  const empty = useMutation(api.notes.empty);
  const restoreAll = useMutation(api.notes.restoreAll);
  const [opened2, { toggle: toggle2 }] = useDisclosure(false);
  const isMobile = useMediaQuery("(max-width: 600px)");

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
      title: "Deleting all notes in trash...",
      loading: true,
      withBorder: true,
      autoClose: false,
      withCloseButton: false,
    });
    await empty()
      .then((res) => {
        notifications.update({
          id,
          title: "All trash notes deleted!",
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
      title: "Restoring all notes in trash...",
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

  if (!notes) {
    return <LoadingOverlay visible={true} />;
  }

  return (
    <div>
      <Group align="start">
        {isMobile && (
          <>
            <Drawer
              size={"55%"}
              opened={opened2}
              onClose={toggle2}
              withCloseButton={false}
            >
              <NotesSidebar data={sidebarDataNotes} />
            </Drawer>
            <Burger
              opened={opened2}
              onClick={toggle2}
              hiddenFrom="xs"
              size="sm"
            />
          </>
        )}
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
      {notes?.length > 0 ? (
        <SimpleGrid
          cols={{ base: 1, xs: 2, sm: 2, md: 3, lg: 3, xl: 4 }}
          mb="xl"
          styles={{ root: { alignItems: "flex-start" } }}
        >
          {notes?.map((note) => (
            <Note key={note?._id} note={note} />
          ))}
        </SimpleGrid>
      ) : (
        <Text fz={rem(32)} fw={700}>
          No Notes Found!!!
        </Text>
      )}
    </div>
  );
};

export default Page;
