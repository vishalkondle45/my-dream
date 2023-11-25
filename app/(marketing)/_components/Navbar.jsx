"use client";
import { SignInButton, UserButton } from "@clerk/clerk-react";
import {
  ActionIcon,
  Avatar,
  Button,
  Group,
  Loader,
  Popover,
  SimpleGrid,
  Text,
} from "@mantine/core";
import {
  IconCalendar,
  IconCircleCheckFilled,
  IconCoinRupeeFilled,
  IconGridDots,
  IconNote,
  IconRobot,
  IconSubtask,
} from "@tabler/icons-react";
import { useConvexAuth } from "convex/react";
import { useState } from "react";
import ToggleColorMode from "../../../components/theme/ToggleColorMode";
import NavItem from "./NavItem";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const { isLoading, isAuthenticated } = useConvexAuth();
  const [opened, setOpened] = useState(false);
  const router = useRouter();
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
        {isLoading && <Loader size="sm" />}
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
                    icon={<IconCircleCheckFilled />}
                    text="Todos"
                  />
                  <NavItem
                    setOpened={setOpened}
                    icon={<IconCoinRupeeFilled />}
                    text="Split"
                  />
                  <NavItem
                    setOpened={setOpened}
                    icon={<IconCalendar />}
                    text="Calendar"
                  />
                  <NavItem
                    setOpened={setOpened}
                    icon={<IconRobot />}
                    text="GPT"
                  />
                  <NavItem
                    setOpened={setOpened}
                    icon={<IconSubtask />}
                    text="Jira"
                  />
                  <NavItem
                    setOpened={setOpened}
                    icon={<IconCoinRupeeFilled />}
                    text="Split"
                  />
                  <NavItem
                    setOpened={setOpened}
                    icon={<IconCoinRupeeFilled />}
                    text="Split"
                  />
                  <NavItem
                    setOpened={setOpened}
                    icon={<IconCoinRupeeFilled />}
                    text="Split"
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
