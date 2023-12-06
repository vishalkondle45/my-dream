"use client";
import { api } from "@/convex/_generated/api";
import { SignInButton, UserButton } from "@clerk/clerk-react";
import {
  ActionIcon,
  Avatar,
  Button,
  Group,
  Indicator,
  LoadingOverlay,
  Notification,
  Popover,
  SimpleGrid,
  Stack,
  Text,
} from "@mantine/core";
import {
  IconBell,
  IconCalendar,
  IconCircleCheck,
  IconClearAll,
  IconCloudRain,
  IconCoinRupee,
  IconFileText,
  IconGridDots,
  IconMessageCircle2,
  IconMusic,
  IconNote,
  IconUserCircle,
} from "@tabler/icons-react";
import { useConvexAuth, useMutation, useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ToggleColorMode from "../../../components/theme/ToggleColorMode";
import NavItem from "./NavItem";

const Navbar = () => {
  const { isLoading, isAuthenticated } = useConvexAuth();
  const [opened, setOpened] = useState(false);
  const router = useRouter();
  const getNotifications = useQuery(api.notifications.get);
  const readAll = useMutation(api.notifications.readAll);
  const readOne = useMutation(api.notifications.readOne);

  return (
    <Group p="md" justify="space-between">
      <Text
        style={{ cursor: "pointer" }}
        onClick={() => router.push("/")}
        fw={700}
        ff={"cursive"}
      >
        Dream
      </Text>
      <Group>
        {isLoading && <LoadingOverlay visible={true} />}
        {!isAuthenticated && !isLoading && (
          <>
            <SignInButton mode="modal">
              <Text fw={700} size="sm" styles={{ root: { cursor: "pointer" } }}>
                Log in
              </Text>
            </SignInButton>
            <SignInButton mode="modal">
              <Button variant="filled" size="compact-sm">
                Join dream free
              </Button>
            </SignInButton>
          </>
        )}
        {isAuthenticated && !isLoading && (
          <>
            <Popover width={330} position="bottom" radius="xl" shadow="md">
              <Popover.Target>
                <ActionIcon title="Notifications" variant="transparent">
                  <Indicator inline label={getNotifications?.length} size={16}>
                    <IconBell />
                  </Indicator>
                </ActionIcon>
              </Popover.Target>
              <Popover.Dropdown styles={{ dropdown: { paddingInline: 0 } }}>
                {getNotifications?.length ? (
                  <>
                    <Group mb="xs" mr="xs" justify="right">
                      <Button
                        size="compact-xs"
                        leftSection={<IconClearAll size={16} />}
                        onClick={() => readAll({})}
                      >
                        Clear all
                      </Button>
                    </Group>
                    <Stack mb="xs" px="xs">
                      {getNotifications?.map((notification) => (
                        <Notification
                          icon={<IconBell size={18} />}
                          key={notification?._id}
                          radius="xs"
                          onClose={() => readOne({ _id: notification._id })}
                          // withBorder
                        >
                          {notification?.message}
                        </Notification>
                      ))}
                    </Stack>
                  </>
                ) : (
                  <Text ta="center">No notifications to show.</Text>
                )}
              </Popover.Dropdown>
            </Popover>
            <Popover
              width={330}
              position="bottom-end"
              radius="xl"
              shadow="md"
              opened={opened}
              onChange={setOpened}
            >
              <Popover.Target>
                <ActionIcon
                  onClick={() => setOpened((o) => !o)}
                  title="Apps"
                  variant="transparent"
                >
                  <IconGridDots />
                </ActionIcon>
              </Popover.Target>
              <Popover.Dropdown>
                <SimpleGrid cols={3}>
                  <NavItem
                    setOpened={setOpened}
                    icon={<IconNote />}
                    text="Notes"
                  />
                  <NavItem
                    setOpened={setOpened}
                    icon={<IconCircleCheck />}
                    text="Todos"
                  />
                  <NavItem
                    setOpened={setOpened}
                    icon={<IconCoinRupee />}
                    text="Split"
                  />
                  <NavItem
                    setOpened={setOpened}
                    icon={<IconCalendar />}
                    text="Calendar"
                  />
                  <NavItem
                    setOpened={setOpened}
                    icon={<IconCloudRain />}
                    text="Weather"
                  />
                  <NavItem
                    setOpened={setOpened}
                    icon={<IconMusic />}
                    text="Music"
                  />
                  <NavItem
                    setOpened={setOpened}
                    icon={<IconFileText />}
                    text="Blog"
                  />
                  <NavItem
                    setOpened={setOpened}
                    icon={<IconMessageCircle2 />}
                    text="Forum"
                  />
                  <NavItem
                    setOpened={setOpened}
                    icon={<IconUserCircle />}
                    text="Profile"
                  />
                </SimpleGrid>
              </Popover.Dropdown>
            </Popover>
            <Avatar variant="transparent" radius="xl" size="sm">
              <UserButton afterSignOutUrl="/" />
            </Avatar>
          </>
        )}
        <ToggleColorMode />
      </Group>
    </Group>
  );
};

export default Navbar;
