"use client";
import { api } from "@/convex/_generated/api";
import {
  getGroupIconByType,
  sidebarDataSplit,
  splitGroupTypes,
} from "@/utils/constants";
import {
  Box,
  Button,
  Group,
  Modal,
  SegmentedControl,
  Stack,
  Text,
  TextInput,
  rem,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconPlus, IconX } from "@tabler/icons-react";
import { useMutation, useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import TodoSidebarItem from "./TodoSidebarItem";

const SplitSidebar = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const create = useMutation(api.groups.create);
  const addUser = useMutation(api.split.addUser);
  const groups = useQuery(api.groups.get);
  const router = useRouter();

  const form = useForm({
    initialValues: {
      name: "",
      type: "trip",
    },
    validate: {
      name: (value) => (value.length ? null : "Group name is required."),
    },
  });

  const createGroup = async (values) => {
    const id = notifications.show({
      title: "Creating a Group...",
      loading: true,
      withBorder: true,
      autoClose: false,
      withCloseButton: false,
    });
    let { group, userId } = await create(values);
    notifications.update({
      id,
      title: "Group created!",
      icon: <IconCheck size={16} />,
      color: "green",
      withBorder: true,
      loading: false,
      autoClose: 2000,
      withCloseButton: true,
    });
    await addUser({ group, user: userId });
    form.reset();
    close();
    router.push(`/split/${group}`);
  };

  return (
    <Box
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignSelf: "start",
      }}
      pr="xl"
      w={rem(200)}
    >
      {sidebarDataSplit.map((item) => (
        <TodoSidebarItem
          icon={item.icon}
          text={item.text}
          route={item.route}
          key={item.route}
        />
      ))}
      <Button
        justify="left"
        variant="subtle"
        leftSection={<IconPlus size={18} />}
        onClick={open}
        radius="xl"
        styles={{ label: { textOverflow: "ellipsis" } }}
      >
        New Group
      </Button>

      <Text size="sm" fw="bold">
        Groups
      </Text>
      {groups?.map((item) => (
        <TodoSidebarItem
          icon={getGroupIconByType(item.type)}
          text={item.name}
          route={`/split/${item._id}`}
          key={item._id}
        />
      ))}

      <Modal
        opened={opened}
        onClose={close}
        title="Create a group"
        withCloseButton={false}
      >
        <form onSubmit={form.onSubmit((values) => createGroup(values))}>
          <Stack>
            <TextInput
              label="Group name"
              placeholder="Enter a group name"
              {...form.getInputProps("name")}
            />
            <SegmentedControl
              data={splitGroupTypes}
              {...form.getInputProps("type")}
            />
            <Group justify="space-between">
              <Button type="button" leftSection={<IconX />} onClick={close}>
                Cancel
              </Button>
              <Button type="submit" leftSection={<IconCheck />}>
                Create
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>
    </Box>
  );
};

export default SplitSidebar;
