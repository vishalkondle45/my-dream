"use client";
import { api } from "@/convex/_generated/api";
import { getGroupIconByType, getGroups } from "@/utils/constants";
import { ActionIcon, Group, Menu, Paper, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconCheck } from "@tabler/icons-react";
import { useMutation, useQuery } from "convex/react";
import GroupMoreSettings from "./GroupMoreSettings";
import GroupUsers from "./GroupUsers";

const GroupSettings = ({ group, splitAmong, paidBy }) => {
  const users = useQuery(api.split.getUsers, { group: group?._id });
  const changeGroupType = useMutation(api.groups.changeGroupType);
  const updateGroupName = useMutation(api.groups.updateGroupName);

  const form = useForm({
    initialValues: {
      name: group.name,
    },
    validate: {
      name: (value) => (value.length ? null : "Please enter valid name"),
    },
  });

  const updateName = (values) => {
    if (form.isDirty("name")) {
      updateGroupName({ group: group._id, name: values.name }).then(() => {
        form.setInitialValues({ name: values.name });
      });
    }
  };

  return (
    <Paper>
      <form onSubmit={form.onSubmit((values) => updateName(values))}>
        <Group gap={0} wrap="nowrap">
          <Menu shadow="md" withArrow>
            <Menu.Target>
              <ActionIcon size="lg" variant="subtle" radius="sm">
                {getGroupIconByType(group?.type)}
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              {getGroups?.map((item) => (
                <Menu.Item
                  key={item.name}
                  onClick={() =>
                    changeGroupType({ group: group._id, type: item.name })
                  }
                  leftSection={item.icon}
                >
                  {item.name}
                </Menu.Item>
              ))}
            </Menu.Dropdown>
          </Menu>
          <TextInput
            w="100%"
            styles={{
              input: {
                backgroundColor: "transparent",
                outline: 0,
                border: 0,
                borderStyle: "none",
                fontWeight: "bold",
                fontSize: 16,
              },
              wrapper: { backgroundColor: "transparent" },
            }}
            placeholder="Group name"
            {...form.getInputProps("name")}
          />
          {form.isDirty("name") && (
            <ActionIcon type="submit" variant="filled" color="green">
              <IconCheck />
            </ActionIcon>
          )}
        </Group>
        <GroupUsers
          group={group}
          users={users}
          splitAmong={splitAmong}
          paidBy={paidBy}
        />
        <GroupMoreSettings />
      </form>
    </Paper>
  );
};

export default GroupSettings;
