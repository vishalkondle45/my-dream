import { api } from "@/convex/_generated/api";
import { colors, sortMap } from "@/utils/constants";
import {
  ActionIcon,
  Button,
  CheckIcon,
  Group,
  Menu,
  Text,
  TextInput,
  ThemeIcon,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import {
  IconArrowsSort,
  IconCheck,
  IconChevronRight,
  IconCursorText,
  IconDots,
  IconList,
  IconPalette,
  IconPrinter,
  IconTrash,
  IconX,
} from "@tabler/icons-react";
import { useMutation } from "convex/react";
import { useState } from "react";

const TodoHeader_ = ({ queryParams, list, setSort }) => {
  const update = useMutation(api.lists.update);
  const [isRename, setIsRename] = useState(false);

  const form = useForm({ initialValues: { rename: list?.title } });

  const onUpdate = async (object) => {
    if (!queryParams?.list_id) return;
    const id = notifications.show({
      title: "Processing...",
      loading: true,
      withBorder: true,
      autoClose: false,
      withCloseButton: false,
    });
    await update({ _id: queryParams?.list_id, ...object })
      .then((res) => {
        notifications.update({
          id,
          title: "Completed!",
          icon: <IconCheck size={16} />,
          color: "green",
          withBorder: true,
          loading: false,
          autoClose: 400,
        });
      })
      .catch((error) => console.log(error))
      .finally(() => setIsRename(false));
  };
  return (
    <Group justify="space-between" wrap="nowrap">
      <Group>
        {!isRename && (
          <ThemeIcon c={list?.color} variant="transparent">
            <IconList />
          </ThemeIcon>
        )}
        {isRename ? (
          <form
            onSubmit={form.onSubmit((values) => {
              onUpdate({
                title: values.rename.length
                  ? values.rename.trim()
                  : list?.title,
              });
              form.setFieldValue("rename", values.rename.trim());
            })}
          >
            <Group>
              <TextInput
                {...form.getInputProps("rename")}
                styles={{ input: { fontWeight: 700 } }}
                radius="xs"
              />
              <Group gap="xs">
                <ActionIcon
                  variant="subtle"
                  color="red"
                  onClick={() => {
                    form.resetDirty();
                    setIsRename(false);
                  }}
                >
                  <IconX />
                </ActionIcon>
                <ActionIcon variant="subtle" color="green" type="submit">
                  <IconCheck />
                </ActionIcon>
              </Group>
            </Group>
          </form>
        ) : (
          <Text
            c={list?.color}
            fw={600}
            onClick={() => setIsRename(true)}
            fz={20}
          >
            {list?.title}
          </Text>
        )}
        {!isRename && (
          <Menu shadow="md">
            <Menu.Target>
              <ActionIcon c={list?.color} variant="transparent">
                <IconDots />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item ta="center" disabled>
                List Options
              </Menu.Item>
              <Menu.Divider />
              <Menu.Item
                onClick={() => {
                  setIsRename(true);
                }}
                onBlur={() => {
                  console.log("onBlur");
                }}
                leftSection={<IconCursorText size={18} />}
              >
                Rename list
              </Menu.Item>
              <Menu trigger="hover" position="right-start">
                <Menu.Target>
                  <Menu.Item
                    leftSection={<IconPalette size={18} />}
                    rightSection={<IconChevronRight size={18} />}
                  >
                    Change theme
                  </Menu.Item>
                </Menu.Target>
                <Menu.Dropdown>
                  <Group gap="xs" p="sm">
                    {colors.map((color) => (
                      <ActionIcon
                        key={color}
                        radius="xl"
                        color={color}
                        onClick={() => onUpdate({ color })}
                      >
                        {color === list?.color && <CheckIcon size={14} />}
                      </ActionIcon>
                    ))}
                  </Group>
                </Menu.Dropdown>
              </Menu>
              <Menu.Item leftSection={<IconPrinter size={18} />}>
                Print list
              </Menu.Item>
              <Menu.Divider />
              <Menu.Item c="red" leftSection={<IconTrash size={18} />}>
                Delete list
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        )}
      </Group>
      <Menu shadow="md" position="bottom-end">
        <Menu.Target>
          <Button
            c={list?.color}
            variant="subtle"
            leftSection={<IconArrowsSort size={16} />}
          >
            Sort
          </Button>
        </Menu.Target>
        <Menu.Dropdown>
          {sortMap?.map((item) => (
            <Menu.Item
              key={item.value}
              onClick={() =>
                setSort((sort) => ({ ...sort, sortBy: item?.value }))
              }
              leftSection={item?.icon}
            >
              {item?.label}
            </Menu.Item>
          ))}
        </Menu.Dropdown>
      </Menu>
    </Group>
  );
};

export default TodoHeader_;
