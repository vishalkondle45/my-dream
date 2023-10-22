"use client";
import { SignInButton, UserButton } from "@clerk/clerk-react";
import { Avatar, Button, Group, Loader, Text } from "@mantine/core";
import { useConvexAuth } from "convex/react";
import Link from "next/link";
import ToggleColorMode from "../../../components/theme/ToggleColorMode";

const Navbar = () => {
  const { isLoading, isAuthenticated } = useConvexAuth();
  return (
    <Group p="md" justify="space-between">
      <Text fw={700} ff={"cursive"}>
        Dream
      </Text>
      <Group>
        {isLoading && <Loader size="sm" type="dots" />}
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
            <Button size="compact-sm" component={Link} href="/">
              Enter Dream
            </Button>
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
