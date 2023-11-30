import {
  ActionIcon,
  Button,
  Divider,
  Group,
  LoadingOverlay,
  Modal,
  Paper,
  Text,
  TextInput,
} from "@mantine/core";
import React, { useState } from "react";
import GroupUser from "./GroupUser";
import { IconPlus, IconSearch, IconX } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { showNotification } from "@mantine/notifications";

const GroupUsers = ({ users, group }) => {
  const [opened, { open, close }] = useDisclosure(false);
  const [loading, handlers] = useDisclosure(false);
  const addUser = useMutation(api.split.addUser);
  const getUserByEmail = useMutation(api.users?.getUserByEmail);
  const [email, setEmail] = useState("");
  const addUserToArray = async () => {
    handlers.open();
    const user = await getUserByEmail({ email });
    if (user) {
      const res = await addUser({ group: group._id, user: user?.subject });
      if (res.message) {
        showNotification({
          color: "red",
          icon: <IconX />,
          message: res.message,
        });
      }
    } else {
      showNotification({
        color: "red",
        icon: <IconX />,
        message: "Email not found",
      });
    }
    handlers.close();
  };

  return (
    <>
      <Paper withBorder shadow="xl" mt="sm" p="sm">
        <TextInput
          w="100%"
          radius="xl"
          leftSection={<IconSearch size={18} />}
          placeholder="Add user with email"
          value={email}
          onChange={(e) => setEmail(e.currentTarget.value)}
          rightSection={
            email && (
              <ActionIcon
                onClick={() => addUserToArray(email)}
                radius="xl"
                variant="subtle"
              >
                <IconPlus />
              </ActionIcon>
            )
          }
        />
        {users?.map((user) => (
          <GroupUser user={user} key={user?._id} />
        ))}
      </Paper>
    </>
  );
};

export default GroupUsers;
