"use client";
import {
  Button,
  Container,
  Group,
  Loader,
  Text,
  useMantineColorScheme,
} from "@mantine/core";
import React from "react";
import ToggleColorMode from "../theme/ToggleColorMode";

const LandingPageNavbar = () => {
  const { colorScheme } = useMantineColorScheme();
  return (
    <Container py="xs" size="xl">
      <Group justify="space-between">
        <Text fw={700} ff={"cursive"}>
          Dream
        </Text>
        <Group>
          <Loader size="sm" color="blue" type="dots" />
          <Button variant="transparent" size="compact-sm">
            Log in
          </Button>
          <Button size="compact-sm">Get dream free</Button>
          <ToggleColorMode />
        </Group>
      </Group>
    </Container>
  );
};

export default LandingPageNavbar;
