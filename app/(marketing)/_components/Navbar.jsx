"use client";
import { Avatar, Button, Container, Group, Loader, Text } from "@mantine/core";
import React from "react";
import ToggleColorMode from "../../../components/theme/ToggleColorMode";
import { SignInButton, UserButton } from "@clerk/clerk-react";
import { useConvexAuth } from "convex/react";
import Link from "next/link";

const Navbar = () => {
  const { isLoading, isAuthenticated } = useConvexAuth();
  return (
    <Group py="md" justify="space-between">
      <Text fw={700} ff={"cursive"}>
        Dream
      </Text>
      <Group>
        {isLoading && <Loader size="sm" color="blue" type="dots" />}
        {!isAuthenticated && !isLoading && (
          <>
            <SignInButton mode="modal">
              <Button variant="transparent" size="compact-sm">
                Log in
              </Button>
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
            <Button size="compact-sm" component={Link} href="/documents">
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
